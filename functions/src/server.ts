import * as express from 'express';
import * as bodyParser from 'body-parser';
import { app } from './app';

const expressApp = express().use(bodyParser.json());

expressApp.post('/fulfillment', app);

expressApp.listen(process.env.PORT || 3129);
