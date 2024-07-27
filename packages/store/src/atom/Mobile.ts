import { atom, selector } from "recoil";
import axios from "axios";

const fetchDataSelector = selector({
    key: 'fetchDataSelector',
    get: async () => {
        const response = await axios.get('http://localhost:1337/api/phone-bills?populate=*', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer c1474c40c37793cbeeca53a59e84714f79e90d172961c41f634ad00642a88856c9f3dbae712af431bd58a64b9c8044260790a3975608c33e6e07112aa97323fb9a806112213c1615582abb9d7ea35d8d4a9067057d7df9d8da6e31da518c7dde5589d83550e1d8472c145bc898add484b4d82186643f87add822c7538663ab25`
            }
        });
       
        return await response.data.data;
    }
});

export const utilityDataAtom = atom({
    key: 'utilityData',
    default: fetchDataSelector
});

