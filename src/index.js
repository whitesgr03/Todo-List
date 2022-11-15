'use strict'

import './css/style.css';


import { createTodoList } from './todoList'


const todoList = createTodoList();     // 建立 new todo

todoList.init();                       // 開始建立變數以及監聽even/t