import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const readfile = readFileSync(resolve('login.post.ts'), 'utf-8')

// changeName -> login, ChangeName -> Login
const changefile = readfile.replace(/changeName/g, 'login').replace(/ChangeName/g, 'Login')
console.log(changefile)
