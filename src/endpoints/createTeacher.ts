import { Request, Response} from 'express'
import {criaDocenteInput, ESPECIALIDADE} from "../types"
import {connection} from "../connection"

async function createTeacher (req: Request, res: Response) {
    let errorCode = 400;
 
    try {
       const input: criaDocenteInput = {
          id: req.body.id,
          nome: req.body.nome,
          email: req.body.email,
          data_nascimento: req.body.data_nascimento,
          especialidades: req.body.especialidades,
          turma_id: req.body.turma_id
       }
 
       if(!input.id || !input.nome || !input.email || !input.data_nascimento || input.especialidades.length < 1) {
          errorCode = 422;
          throw new Error("Preencha os campos corretamente");
       }
 
       await connection.raw(`
       INSERT INTO DOCENTE(id, nome, email, data_nascimento, turma_id)
       VALUES(
          ${input.id},
          "${input.nome}",
          "${input.email}",
          "${input.data_nascimento}",
          ${input.turma_id}
       );
       `)
 
       for (let especialidade of input.especialidades) {
          await connection.raw(`
          INSERT INTO DOCENTE_ESPECIALIDADE(docente_id, especialidade_id)
          VALUES(
             ${input.id},
             ${ESPECIALIDADE[especialidade]}
          )
          `)
       }
 
       res.status(201).send({message: "Conseguimos criar!"})
 
    } catch (error) {
       res.status(errorCode).send({message: error.message})
    }
 }

 export default createTeacher