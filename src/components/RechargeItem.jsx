/**
 * Created by RaoMeng on 2018/11/14
 * Desc: 充值缴费item
 */

import React, {Component} from 'react'
import RechargeBean from 'model/RechargeBean'
import 'css/payment.css'
import {isObjEmpty} from "../utils/common";
import {Toast} from 'antd-mobile'

export default class RechargeItem extends Component {

    constructor() {
        super()

        this.state = {
            rechargeBean: new RechargeBean()
        }
    }

    componentDidMount() {
        this.setState({
            rechargeBean: this.props.rechargeBean
        })
    }

    render() {
        const {rechargeBean} = this.state

        return (
            <div style={{padding: '0 10px'}}>
                <div className='recharge-item-root'>
                    <div className='recharge-item-type'>{rechargeBean.payName}</div>
                    <div className='gray-line' style={{height: '1px', marginBottom: '10px'}}></div>
                    <div className='recharge-item-line'>
                        <div className='recharge-item-caption'>发起人：</div>
                        <div className='recharge-item-value'>{rechargeBean.userName}</div>
                    </div>
                    <div className='recharge-item-line'>
                        <div className='recharge-item-caption'>截止日期：</div>
                        <div className='recharge-item-value'>{rechargeBean.endTime}</div>
                    </div>
                    {isObjEmpty(rechargeBean.remarks) ? '' : <div className='recharge-item-line'>
                        <div className='recharge-item-caption'>备注：</div>
                        <div className='recharge-item-value'>{rechargeBean.remarks}</div>
                    </div>}

                    <div className='recharge-item-bottom'>
                        <div className={rechargeBean.statusCode === 4 ?
                            'recharge-item-amount-todo' :
                            'recharge-item-amount-done'}>{'￥:' + rechargeBean.amount}</div>
                        <div className={rechargeBean.statusCode === 4 ?
                            'recharge-item-btn-todo' :
                            'recharge-item-btn-done'}
                             onClick={rechargeBean.statusCode === 4 ?
                                 this.onRechargeClick : null}>{rechargeBean.status}</div>
                    </div>
                </div>
            </div>
        )
    }

    onRechargeClick = () => {
        Toast.fail('暂未对接支付功能，敬请期待！', 2)
    }
}
