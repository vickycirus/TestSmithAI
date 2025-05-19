pip install fastapi uvicorn asyncio requests
npm install jest
npm install
ollama run codellama:7b

To start:
npm run dev
uvicorn backend.api:app --reload --port 8000 --log-level debug