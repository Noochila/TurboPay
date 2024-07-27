import styles from './new-customer.module.css'
import { useNavigate } from 'react-router-dom'

export function NewCustomer() {
    const navigate = useNavigate()

    const onNewCustomer = e => {
        e.preventDefault()

        const username = e.target.username.value
        const acNm = e.target.acNm.value
        const balance = Number(e.target.balance.value)
        const password = e.target.password.value

        console.log(`Id ${username} Name ${acNm} Bal ${balance} Pass ${password}`)

        fetch('http://localhost:3100/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, acNm, balance, password })
        }).then(res => res.json())
            .then(json => {
                console.log(json);
                // Assuming the response contains a token and username
                const { token, username } = json;
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        navigate('/')
    }

    return (
        <div className={styles.custCont}>
            <h1> Create New Customer </h1>
            <form onSubmit={onNewCustomer}>
                <input type='text' placeholder='User Name' name='username' />
                <input type='text' placeholder='Account Name' name='acNm' />
                <input type='number' placeholder='Balance' name='balance' />
                <input type='password' placeholder='Password' name='password' />
                <input type='submit' value='Create' />
            </form>
        </div>
    )
}