import app from '../app';

const PORT: number = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log(`${PORT}번에서 서버 가동`);
});