import { useRecoilValue } from "recoil";
import { utilityDataAtom } from "../atom/Mobile";


export async function useMobileData() {

    const mobileData = await useRecoilValue(utilityDataAtom);


    return mobileData;
};
