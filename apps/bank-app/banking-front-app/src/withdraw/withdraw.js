import styles from './withdraw.module.css'

import { useNavigate } from 'react-router-dom';

export function Withdraw() {
    const navigate = useNavigate()



    const onWithdraw = (e) => {
        e.preventDefault();

        const username = localStorage.getItem('username')
        if (username == null) {
            navigate('/signin')
        }
        const amount = Number(e.target.amount.value)


        fetch(`http://localhost:3100/withdraw`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, amount })
        }).then(res => res.json())
            .then(json => console.log(json));

            navigate('/')
    }

    return (
        <>
            <div className={styles.wthCont}>
                <h1>Withdraw Amount</h1>
                <form onSubmit={onWithdraw}>
                    <input type='number' placeholder='Amount' name='amount' />
                    <input type='submit' value='Withdraw' />
                </form>
            </div>
        </>
    );
}