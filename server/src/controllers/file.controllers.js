import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../services/cloudinary.services.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Queue } from "bullmq";
import { FILE } from "../models/file.models.js";
import path from "path";
import { extractTextFromFile } from "../utils/helper.js";
import { UserRolesEnum } from "../constant.js";

const queue = new Queue("file-upload-queue", {
  connection: {
    url: "redis://redis:6379",
  },
});

const uploadMultiFileRAG = asyncHandler(async (req, res) => {
  const files = req.files;
  const userId = req.user?._id?.toString();
  const companyId = req.user?.companyId?.toString();
  const userRole = req.user?.role;

  if (!files || files.length === 0) {
    throw new ApiError(400, "No files uploaded.");
  }

  // ❌ Block COMPANYMEMBERs from uploading
  if (userRole === UserRolesEnum.COMPANYMEMBER) {
    throw new ApiError(403, "Company members are not allowed to upload files.");
  }

  // ❌ COMPANYADMIN must have valid companyId
  if (userRole === UserRolesEnum.COMPANYADMIN && !companyId) {
    throw new ApiError(400, "Company ID not found for admin user.");
  }

  const results = [];

  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();

    const allowedExtensions = [
      ".pdf",
      ".docx",
      ".png",
      ".jpg",
      ".jpeg",
      ".txt",
    ];

    if (!allowedExtensions.includes(ext)) {
      results.push({
        filename: file.originalname,
        status: "failed",
        error: "Unsupported file format",
      });
      continue;
    }

    try {
      // ✅ Upload to Cloudinary
      const uploadResult = await uploadOnCloudinary(file.path);

      const fileDoc = await FILE.create({
        Urls: [uploadResult.secure_url],
        companyId: userRole === UserRolesEnum.COMPANYADMIN ? companyId : null,
        owner: userId,
      });

      if (!fileDoc) {
        throw new ApiError(400, "Failed to save file info to DB", []);
      }

      const extractedText = await extractTextFromFile(
        file,
        uploadResult.secure_url
      );

      // Queue job for vector processing
      await queue.add(
        "file-ready",
        {
          originalFilename: file.originalname,
          textChunks: extractedText,
          fileUrl: uploadResult.secure_url,
          userId,
          companyId,
          userRole, // ✅ Added this for worker to decide vector collection
          fileId: fileDoc?._id?.toString(),
        },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
        }
      );

      results.push({
        filename: file.originalname,
        status: "success",
        cloudinaryUrl: uploadResult.secure_url,
        userId,
        companyId,
      });
    } catch (err) {
      results.push({
        filename: file.originalname,
        status: "failed",
        error: err.message,
      });
    }
  }

  return res
    .status(207)
    .json(
      new ApiResponse(207, { results }, "Multi-format file upload processed")
    );
});

export { uploadMultiFileRAG };
