import styles from '../new-customer/new-customer.module.css'
import { useNavigate } from 'react-router-dom'

export function SignIn() {
    const navigate = useNavigate()

    const onSignIn = e => {
        e.preventDefault()

        const username = e.target.username.value
        const password = e.target.password.value

        fetch('http://localhost:3100/signin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                localStorage.setItem('token', json.token)
                localStorage.setItem('username', username)
            })

        navigate(-1)
    }

    return (
        <div className={styles.custCont}>
            <h1> Sign In Old Customer </h1>
            <form onSubmit={onSignIn}>
                <input type='text' placeholder='User Name' name='username' />
                <input type='password' placeholder='Password' name='password' />
                <input type='submit' value='Login' />
            </form>
        </div>
    )
}