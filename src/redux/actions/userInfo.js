/**
 * Created by RaoMeng on 2018/12/10
 * Desc: 用户信息缓存
 */

import {USER_INFO} from "../constants/actionTypes";
import store from '../store/store'

export const switchUser = (data) => {
    console.log("switchUser()",data);
    return () => {
        store.dispatch({
            type: USER_INFO,
            ...data
        })
    }
}