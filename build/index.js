"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.connection = knex_1.default({
    client: "mysql",
    connection: {
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
});
const app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
var TIPO_TURMA;
(function (TIPO_TURMA) {
    TIPO_TURMA["INTEGRAL"] = "integral";
    TIPO_TURMA["NOTURNO"] = "noturno";
})(TIPO_TURMA || (TIPO_TURMA = {}));
app.post("/turma", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let errorCode = 400;
    try {
        const input = {
            id: req.body.id,
            nome: req.body.nome,
            data_inicio: req.body.data_inicio,
            data_fim: req.body.data_fim,
            modulo: 0,
            tipo: req.body.tipo
        };
        if (!input.id || !input.nome || !input.data_inicio || !input.data_fim || !input.tipo) {
            errorCode = 422;
            throw new Error("Preencha os campos corretamente");
        }
        if (input.tipo !== TIPO_TURMA.INTEGRAL && input.tipo !== TIPO_TURMA.NOTURNO) {
            errorCode = 422;
            throw new Error("os valores possíveis são 'integral' ou 'noturno'");
        }
        if (input.tipo === TIPO_TURMA.NOTURNO) {
            input.nome = input.nome += "-na-night";
        }
        yield exports.connection.raw(`
         INSERT INTO TURMA (id, nome, data_inicio, data_fim, modulo)
         VALUES(
            ${input.id},
            "${input.nome}",
            "${input.data_inicio}",
            "${input.data_fim}",
            ${input.modulo}
         )
      `);
        res.status(201).send({ message: "Turma criada com sucesso!" });
    }
    catch (error) {
        res.status(errorCode).send({ message: error.message });
    }
}));
app.post("/estudante", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let errorCode = 400;
    try {
        const input = {
            id: req.body.id,
            nome: req.body.nome,
            email: req.body.email,
            data_nasc: req.body.data_nasc,
            hobbies: req.body.hobbies,
            turma_id: req.body.turma_id
        };
        if (!input.id || !input.nome || !input.email || !input.data_nasc || input.hobbies.length < 1) {
            errorCode = 422;
            throw new Error("Preencha os campos corretamente");
        }
        yield exports.connection.raw(`
      INSERT INTO ESTUDANTE(id, nome, email, data_nasc, turma_id)
      VALUES(
         ${input.id},
         "${input.nome}",
         "${input.email}",
         "${input.data_nasc}",
         ${input.turma_id}
      )
      `);
        for (let hobby of input.hobbies) {
            const idPassatempo = Math.floor(Math.random() * 1000000);
            yield exports.connection.raw(`
         INSERT INTO PASSATEMPO(id, nome)
         VALUES(
            ${idPassatempo}
            "${hobby}"
         )
         `);
            yield exports.connection.raw(`
         INSERT INTO ESTUDANTE_PASSATEMPO(estudante_id, passatempo_id)
         VALUES(
            ${input.id},
            ${idPassatempo}
         )
         `);
        }
        res.status(201).send({ message: "Conseguimos criar!" });
    }
    catch (error) {
        res.status(errorCode).send({ message: error.message });
    }
}));
const server = app.listen(process.env.PORT || 3003, () => {
    if (server) {
        const address = server.address();
        console.log(`Server is running in http://localhost: ${address.port}`);
    }
    else {
        console.error(`Failure upon starting server.`);
    }
});
//# sourceMappingURL=index.js.map