import dotenv from "dotenv";
dotenv.config();

console.log(process.env.DB_HOST);	// 127.0.0.1
console.log(process.env.DB_PORT);	// 3306
console.log(process.env.DB_USER);	// root
console.log(process.env.DB_PASSWORD);	// 0000