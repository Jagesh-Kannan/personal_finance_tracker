import express from 'express';
import { extract_file_data } from '../controller/fileExtractor.controller.js';

const fileExtractor_route = express.Router();

fileExtractor_route.post('/', extract_file_data);

export default fileExtractor_route;