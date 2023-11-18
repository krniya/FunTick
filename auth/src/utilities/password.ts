import {scrypt, randomBytes} from 'crypto'
import {promisify} from 'util'

//* scrypt is callback based
//* converting it to promise to use async-await
const scryptAsync = promisify(scrypt);

export class Password {
    //* takes password and hash it using random 8 digit salt
    //* and return the hashed password and salt concat with '.'
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex')
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer
        return `${buffer.toString('hex')}.${salt}`
    }

    //* compares stored password and supplied password by hashing
    //* supplied password using the salt available in stored passwrod
    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer
        return buffer.toString('hex') === hashedPassword
    }
}