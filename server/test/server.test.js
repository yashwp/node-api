const expect = require('expect');
const supertest = require('supertest');

const {app} = require('./../server');
const {todo} = require('./../models/todo');