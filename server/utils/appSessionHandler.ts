import pg from 'pg'
import express from 'express';
const { v4: uuidv4 } = require('uuid');
import * as salesforceSchema from './salesforce'
import {queryParameters} from './helperSchemas';
import { ExecException } from 'child_process';

export function createAppSession(accountNumber: string, applicationId: string, sessionId : string, pgClient:pg.Client, userInstances:any, res: express.Response){
    let time = Date.now()
    let intervalRef = setInterval(()=>{
      console.log(`check for activity: ${sessionId}`)
      let query:{text:string, values:Array<string>} = {
        text:'SELECT * FROM salesforce.application_session WHERE session_id = $1',
        values:[sessionId]
      }
      pgClient.query(query).then((result:pg.QueryResult)=>{
        let time = Date.now()
        let appSession: salesforceSchema.application_session = result.rows[0]
        let elapsedTime = (time - appSession.last_active)
        console.log(`elapsed time: ${elapsedTime} sessionId: ${sessionId}`)
        if(elapsedTime > 30000){
          console.log(`delete ${sessionId}`)
          clearInterval(userInstances[sessionId])
          let deleteQuery:{text:string, values:Array<string>} = {
            text:'DELETE FROM salesforce.application_session WHERE session_id = $1',
            values: [sessionId]
          }
          pgClient.query(deleteQuery)
        }
      })
    },5000,sessionId)
    
    userInstances[sessionId] = intervalRef
  
    let sessionInsert : queryParameters = {
      text:'INSERT INTO salesforce.application_session(account_number, application_id, last_active, session_id) VALUES($1,$2,$3,$4)',
      values:[accountNumber, applicationId, time, sessionId]
    }
    pgClient.query(sessionInsert).then((result:pg.QueryResult)=>{
      res.json({sessionId:sessionId})
      return
    }).catch((err:ExecException)=>{
      clearInterval(intervalRef)
      userInstances[sessionId] = undefined
      console.log(err)
      console.log('failed to insert session')
      res.status(500).send('Could not create session');
    })
  }