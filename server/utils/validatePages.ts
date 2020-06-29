import pg from 'pg'
import express from 'express'
import {validated_pages} from './salesforce'
import {requestBody} from '../../client/src/helpers/Utils'
import {generateQueryString, runQueryReturnPromise} from './saveStateHandlers'
import { queryParameters } from './helperSchemas';

export function getValidatedPages(sessionId: string, pgClient: pg.Client, res: express.Response){
  
    let validationQuery ={
      text: 'SELECT * FROM salesforce.validated_pages WHERE session_id = $1',
      values: [sessionId]
    }
    pgClient.query(validationQuery).then(function(result:pg.QueryResult<validated_pages>){
      let validationFields = result.rows[0];
      console.log(validationFields)
      res.send({data: validationFields});
    }).catch(err=>{
      console.log(err);
      console.log('failed to update validated pages table');
      res.status(500).send('Failed to update validated pages');
    })
  
}

export function saveValidatedPages(sessionId: string, validatePages: validated_pages, pgClient: pg.Client, res: express.Response){
  
    let pageValidation : Partial<validated_pages> = {
      ...validatePages,
      session_id:sessionId
    }
    let queryParam :queryParameters = generateQueryString('validated_pages',pageValidation,'session_id');
    runQueryReturnPromise(queryParam, pgClient).then((response:pg.QueryResult)=>{
      res.send('ok');
    }).catch(err=>{
      console.log(err);
      console.log('failed to update validated pages table');
      res.status(500).send('Failed to update validated pages');
    })
  
  }