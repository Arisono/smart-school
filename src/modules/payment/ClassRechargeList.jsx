/**
 * Created by RaoMeng on 2018/11/23
 * Desc: 班级交费列表
 */

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import 'css/payment.css'
import {Toast} from 'antd-mobile'
import {List, Icon, Skeleton} from 'antd'
import ClassRechargeItem from 'components/ClassRechargeItem'
import ClassRechargeBean from 'model/ClassRechargeBean'
import RefreshLayout from '../../components/RefreshLayout'
import {fetchGet} from "../../utils/fetchRequest";
import {API} from "../../configs/api.config";
import {getIntValue, getStrValue, isObjEmpty} from "../../utils/common";
import {connect} from 'react-redux'
import {saveListState} from 'action/listState'

const mPageSize = 10
let mPageIndex = 0

class ClassRechargeList extends Component {

    constructor() {
        super()

        this.state = {
            rechargeList: [],
            isLoading: true,
            isRefreshing: false,
        }
    }

    componentWillMount() {
        document.title = '班级收费'
    }

    componentDidMount() {
        console.log(this.props.listState)
        if (this.props.listState && !isObjEmpty(this.props.listState.listData)) {
            this.setState({
                rechargeList: this.props.listState.listData,
                isLoading: false,
            }, () => {
                ReactDOM.findDOMNode(this.container).scrollTop = this.props.listState.scrollTop
            })
            mPageIndex = this.props.listState.pageIndex
        } else {
            Toast.loading('努力加载中...', 1)
            mPageIndex = 0
            this.loadRechargeList()
        }
    }

    componentWillReceiveProps(newProps) {
    }

    componentWillUnmount() {
        Toast.hide()
    }

    render() {
        const {rechargeList, isLoading, isRefreshing} = this.state

        return (
            <div className='recharge-page-layout' style={{background: '#F2F2F2', padding: '0 10px'}}>
                <RefreshLayout
                    refreshing={isRefreshing}
                    ref={el => {
                        this.container = el
                    }}
                    onRefresh={this.loadRechargeList}>
                    <Skeleton loading={isLoading} active paragraph={{rows: 3}}>
                        <List dataSource={rechargeList}
                              renderItem={(item, index) => (
                                  <ClassRechargeItem
                                      classRecharge={item}
                                      onItemClick={this.onItemClick.bind(this)}
                                      index={index}/>
                              )}/>
                    </Skeleton>
                </RefreshLayout>

                <Icon type="plus-circle" theme='filled' className='common-add-icon'
                      onClick={this.onAddRecharge}/>
            </div>
        )
    }

    loadRechargeList = () => {
        mPageIndex++
        console.log(mPageIndex)
        try {
            this.setState({
                isRefreshing: true
            })
        } catch (e) {

        }

        const {rechargeList} = this.state
        if (mPageIndex === 1) {
            rechargeList.length = 0
        }

        fetchGet(API.PAYMENT_PAYMENTLIST_TEACHER, {
            userId: this.props.userInfo.userId,
            pageIndex: mPageIndex,
            pageSize: mPageSize
        }).then(response => {
            Toast.hide()

            if (response && response.data && response.data.length > 0) {
                let dataArray = response.data
                for (let i = 0; i < dataArray.length; i++) {
                    let dataObject = dataArray[i]
                    if (dataObject) {
                        let rechargeBean = new ClassRechargeBean()

                        rechargeBean.payId = getIntValue(dataObject, 'payId')
                        rechargeBean.title = getStrValue(dataObject, 'payName')
                        rechargeBean.statusCode = getIntValue(dataObject, 'payStatus')
                        if (rechargeBean.statusCode === 1) {
                            rechargeBean.status = '草稿'
                        } else if (rechargeBean.statusCode === 2) {
                            rechargeBean.status = '已发布'
                        } else if (rechargeBean.statusCode === 3) {
                            rechargeBean.status = '已结束'
                        } else if (rechargeBean.statusCode === 4) {
                            rechargeBean.status = '收款中'
                        } else if (rechargeBean.statusCode === 5) {
                            rechargeBean.status = '已支付'
                        } else if (rechargeBean.statusCode === 6) {
                            rechargeBean.status = '已退款'
                        } else if (rechargeBean.statusCode === 7) {
                            rechargeBean.status = '已收款'
                        }

                        rechargeBean.percapita = getIntValue(dataObject, 'payTotal')
                        rechargeBean.endTime = getStrValue(dataObject, 'payEndDate')
                        rechargeBean.remarks = getStrValue(dataObject, 'payRemarks')
                        if (dataObject.userPayments) {
                            let userPay = dataObject.userPayments.userPay || []
                            let userUnPay = dataObject.userPayments.userUnPay || []
                            rechargeBean.totalPerson = userPay.concat(userUnPay)
                            rechargeBean.paid = userPay

                            try {
                                rechargeBean.money = (getIntValue(dataObject, 'payTotal') * (rechargeBean.totalPerson.length)).toFixed(2)
                            } catch (e) {
                                rechargeBean.money = getIntValue(dataObject, 'payTotal') * (rechargeBean.totalPerson.length)
                            }
                        }

                        rechargeList.push(rechargeBean)
                    }
                }
            } else {
                if (mPageIndex > 1) {
                    mPageIndex--
                }
            }

            this.setState({
                rechargeList,
                isLoading: false,
                isRefreshing: false,
            })
        }).catch(error => {
            Toast.hide()

            if (mPageIndex > 1) {
                mPageIndex--
            }
            this.setState({
                isLoading: false,
                isRefreshing: false
            })
            if (typeof error === 'string') {
                Toast.fail(error, 2)
            } else {
                Toast.fail('数据请求异常', 2)
            }
        })
    }

    onAddRecharge = () => {
        saveListState({
            scrollTop: ReactDOM.findDOMNode(this.container).scrollTop,
            listData: this.state.rechargeList,
            pageIndex: mPageIndex,
        })()
        this.props.history.push('/rechargeRelease')
    }

    onItemClick = index => {
        saveListState({
            scrollTop: ReactDOM.findDOMNode(this.container).scrollTop,
            listData: this.state.rechargeList,
            pageIndex: mPageIndex,
            itemIndex: index,
        })()
        const {rechargeList} = this.state
        this.props.history.push('/classRechargeDetail/' + rechargeList[index].payId)
    }
}

let mapStateToProps = (state) => ({
    userInfo: {...state.redUserInfo},
    listState: {...state.redListState}
})

let mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ClassRechargeList)
