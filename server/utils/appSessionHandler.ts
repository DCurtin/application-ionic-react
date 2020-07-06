import pg from 'pg'
import express from 'express';
const { v4: uuidv4 } = require('uuid');
import * as postgresSchema from './postgresSchema'
import {queryParameters} from './helperSchemas';
import { ExecException } from 'child_process';

export function createAppSession(appSession: Partial<postgresSchema.application_session>, pgClient:pg.Client, userInstances:any, res: express.Response){
    appSession.last_active = Date.now()
    let intervalRef = setInterval(()=>{
      console.log(`check for activity: ${appSession.session_id}`)
      let query:{text:string, values:Array<string>} = {
        text:'SELECT * FROM salesforce.application_session WHERE session_id = $1',
        values:[appSession.session_id]
      }
      pgClient.query(query).then((result:pg.QueryResult)=>{
        let time = Date.now()
        let appSession: postgresSchema.application_session = result.rows[0]
        let elapsedTime = (time - appSession.last_active)
        console.log(`elapsed time: ${elapsedTime} sessionId: ${appSession.session_id}`)
        if(elapsedTime > 3600000){
          console.log(`delete ${appSession.session_id}`)
          clearInterval(userInstances[appSession.session_id])
          let deleteQuery:{text:string, values:Array<string>} = {
            text:'DELETE FROM salesforce.application_session WHERE session_id = $1',
            values: [appSession.session_id]
          }
          pgClient.query(deleteQuery)
        }
      })
    },60000,appSession.session_id)
    
    userInstances[appSession.session_id] = intervalRef
  
    let sessionInsert : queryParameters = {
      text:'INSERT INTO salesforce.application_session(account_number, application_id, last_active, session_id) VALUES($1,$2,$3,$4)',
      values:[appSession.account_number, appSession.application_id, appSession.last_active, appSession.session_id]
    }
    pgClient.query(sessionInsert).then((result:pg.QueryResult)=>{
      res.json({sessionId:appSession.session_id})
      return
    }).catch((err:ExecException)=>{
      clearInterval(intervalRef)
      userInstances[appSession.session_id] = undefined
      console.log(err)
      console.log('failed to insert session')
      res.status(500).send('Could not create session');
    })
  }