import { Request, Response} from 'express'
import {criaEstudanteInput} from "../types"
import {connection} from "../connection"

async function createStudent (req: Request, res: Response) {
    let errorCode = 400;
 
    try {
       const input: criaEstudanteInput = {
          id: req.body.id,
          nome: req.body.nome,
          email: req.body.email,
          data_nascimento: req.body.data_nascimento,
          hobbies: req.body.hobbies,
          turma_id: req.body.turma_id
       }
 
       if(!input.id || !input.nome || !input.email || !input.data_nascimento || input.hobbies.length < 1) {
          errorCode = 422;
          throw new Error("Preencha os campos corretamente");
       }
 
       await connection.raw(`
       INSERT INTO ESTUDANTE(id, nome, email, data_nascimento, turma_id)
       VALUES(
          ${input.id},
          "${input.nome}",
          "${input.email}",
          "${input.data_nascimento}",
          ${input.turma_id}
       );
       `)
 
       for (let hobby of input.hobbies) {
          const idPassatempo = Math.floor(Math.random() * 1000000);
          await connection.raw(`
          INSERT INTO PASSATEMPO(id, nome)
          VALUES(
             ${idPassatempo},
             "${hobby}"
          )
          `)
 
          await connection.raw(`
          INSERT INTO ESTUDANTE_PASSATEMPO(estudante_id, passatempo_id)
          VALUES(
             ${input.id},
             ${idPassatempo}
          )
          `)
       }
 
       res.status(201).send({message: "Conseguimos criar!"})
 
    } catch (error) {
       res.status(errorCode).send({message: error.message})
    }
 }

 export default createStudent