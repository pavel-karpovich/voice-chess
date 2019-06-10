import * as functions from 'firebase-functions';
import { app } from './app';

export const fulfillment = functions.https.onRequest(app);