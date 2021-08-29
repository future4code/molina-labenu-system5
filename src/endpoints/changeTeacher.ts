import { Request, Response} from 'express'
import {atualizaDocenteInput} from "../types"
import {connection} from "../connection"

async function changeTeacher (req: Request, res: Response) {
    let errorCode = 400;
    try {
 
       const input: atualizaDocenteInput = {
          docente_id: req.body.docente_id,
          turma_id: req.body.turma_id
       }
 
       await connection.raw(`
       UPDATE DOCENTE 
       SET turma_id = ${input.turma_id}
       WHERE id = ${input.docente_id}
       `)
 
       res.status(200).send({message: "Atualizado com sucesso!"})
 
    } catch (error) {
       if(error.message.includes("foreign key constraint fails")) {
          errorCode = 422;
          error.message = "Turma inexistente!"
       }
       res.status(errorCode).send({message: error.message})
    }
 }

 export default changeTeacher