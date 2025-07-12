## Contributors

Thanks to all these awesome people for their contributions:

- [@emmetCode](https://github.com/emmetCode) -----> frontend developer


RAG-APP is a scalable, document-based Retrieval-Augmented Generation (RAG) system designed for querying and processing diffrent file documents. Built with a modern tech stack including Node.js, MongoDB, QdrantDB, Redis, express, Cohere LLM for embedding and a microservices architecture. Rag-PDF supports background workers for efficient task management and seamless scalability in production environments.

Key Features

a) Diffrent File ingestion and processing with intelligent chunking and embedding

b) Vector-based retrieval using Qdrant, optimized for semantic search 

c) Retrieval-Augmented Generation using LLMs to answer questions based on document content

d) Microservices-based architecture for modularity and scalability

e) MongoDB storage for managing document metadata 

f) Background workers for handling long-running tasks asynchronously

g) Designed for production-scale deployments


---

## 🏁 Installation

You can run the project either using Docker (recommended) or set it up locally.

---

## 📦 Using Docker (Recommended)

To run the RAG-APP project using Docker:

1. **Install Docker** on your machine: [Get Docker](https://docs.docker.com/get-docker/)
2. **Clone the project repository**:
   ```bash
   git clone AnjanG7/RGF-APP
   
   ```
3. **Navigate to the `server` directory** and create a `.env` file:
   ```bash
   cd server
   cp .env.sample .env
   # Edit .env and add your credentials
   ```
4. **Return to the root directory and run Docker Compose**:
   ```bash
   docker compose up -d
   ```

This will start the client, server, and worker services in containers.

---

## 💻 Running Locally

To run the Rag-pdf project locally:

1. **Install the following dependencies**:
   - [Node.js](https://nodejs.org/)
   - [MongoDB](https://www.mongodb.com/try/download/community)
   - [MongoDB Compass (optional)](https://www.mongodb.com/products/compass)

2. **Clone the project repository**:
   ```bash
   git clone AnjanG7/RGF-APP

   ```

3. **Set up environment variables**:
   ```bash
   cd server
   cp .env.sample .env
   # Add necessary credentials to .env
   ```

4. **Install dependencies in root**:
   ```bash
   npm install
   ```

---

### 🚀 Starting the Application

#### 1. Start the **Frontend**

```bash
cd client
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) in your browser.

#### 2. Start the **Backend**

```bash
cd server
npm run dev
```

#### 3. Start the **Worker for background process**

```bash
npm run dev:worker
```

---

## 🛠️ Technologies Used

- **Node.js**
- **MongoDB**
- **Express**
- **nextjs**
- **Docker**
- **Redis for BullMQ (Worker Queue)**
- **clerk for authentication**
- **Cohere LLM**
- **Qdrant DB**
- **Cloudinary**
---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Add comment


