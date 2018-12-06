/**
 * Created by RaoMeng on 2018/11/14
 * Desc: 收费发布
 */

import React, {Component} from 'react'
import {Input, Button} from 'antd'
import {Picker, InputItem, DatePicker, List, Toast} from 'antd-mobile'
import 'css/payment.css'
import {API} from 'api'
import TargetSelect from 'components/TargetSelect'
import {fetchPost} from "../../utils/fetchRequest";
import {getStrValue, isObjEmpty} from "../../utils/common";
import {regExpConfig} from "../../configs/regexp.config";
import {connect} from 'react-redux'

const {TextArea} = Input
const teacherData = []
const parentData = []

for (let i = 1; i < 6; i++) {
    parentData.push({
        title: `三年级${i}班`,
        value: `0-${i}`,
        key: `0-${i}`,
        children: [{
            title: `饶猛`,
            value: `0-${i}-0`,
            key: `0-${i}-0`
        }, {
            title: `李泞`,
            value: `0-${i}-1`,
            key: `0-${i}-1`,
        }, {
            title: `章晨望`,
            value: `0-${i}-2`,
            key: `0-${i}-2`,
        }],
    })
}

const targetData = [
    {
        title: `全体家长`,
        value: `0`,
        key: `0`,
        children: parentData,
    },
    {
        title: `全体老师`,
        value: `1`,
        key: `1`,
        children: teacherData,
    }
]

for (let i = 1; i < 10; i++) {
    teacherData.push({
        title: `老师${i}`,
        value: `1-${i}`,
        key: `1-${i}`,
    })
}

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class RechargeRelease extends Component {

    constructor() {
        super()

        this.state = {
            typeList: [],
            classText: '',
            remarks: '',
            endTime: now,
            percapita: '',
            targetList: ['1-1'],
            targetCount: 1
        }
    }

    componentDidMount() {
        document.title = '收费发布'

        const {typeList} = this.state

        typeList.push({
            label: '学校收费',
            value: '0'
        })
        typeList.push({
            label: '班级收费',
            value: '1'
        })
        typeList.push({
            label: '学杂费',
            value: '2'
        })
        typeList.push({
            label: '书本费',
            value: '3'
        })

        this.setState({typeList: typeList})
    }

    componentWillUnmount() {
        Toast.hide()
    }

    render() {
        const {
            typeList, classText, remarks,
            targetCount, targetList, percapita
        } = this.state

        const targetProps = {
            targetData: targetData,
            targetValues: targetList,
            title: '收款对象',
            targetCount: targetCount,
            onTargetChange: this.onTargetChange.bind(this)
        }

        return (
            <div className='common-column-layout'>
                <div className='gray-line'></div>
                <TargetSelect {...targetProps}/>
                <div className='gray-line'></div>
                <Picker
                    data={typeList} title='收款类型' extra='请选择'
                    value={classText} onChange={this.handleClassChange} cols={1}>
                    <List.Item arrow="horizontal">收款类型</List.Item>
                </Picker>
                <div className='gray-line'></div>
                <div className='recharge-release-money-title'>人均收款金额</div>
                <div className='recharge-release-amount-layout'>
                    <div className='recharge-release-amount-caption'>￥</div>
                    <InputItem
                        className='recharge-release-amount-input'
                        type='money' clear
                        moneyKeyboardAlign='left'
                        placeholder='请输入金额'
                        value={percapita}
                        onChange={this.amountChange}/>
                </div>
                <TextArea className='remarks-input' placeholder='请输入备注'
                          autosize={{minRows: 4, maxRows: 8}} value={remarks}
                          onChange={this.remarksChange}/>
                <div className='gray-line'></div>
                <DatePicker
                    value={this.state.endTime}
                    onChange={this.onDateChange}>
                    <List.Item arrow="horizontal">截止时间</List.Item>
                </DatePicker>
                <div className='gray-line'></div>

                <Button type='primary'
                        style={{margin: '35px'}}
                        className='commonButton'
                        onClick={this.onRechargeRelease}>发起收款</Button>
            </div>
        )
    }

    onRechargeRelease = () => {
        const {classText, remarks, percapita, endTime, typeList} = this.state

        console.log(typeList[classText].label + '/' + Number(classText) + '/' + remarks + '/' + percapita + '/' + endTime.format('yyyy-MM-dd hh:mm:ss'));

        if (isObjEmpty(classText, percapita, endTime)) {
            Toast.fail('存在未填项', 2)
            return
        }

        if (!regExpConfig.float.test(percapita)) {
            Toast.fail('请输入正确的收款金额')
            return
        }
        Toast.loading('正在发布...', 0)

        const userList = ['10000', '10001', '10002', '10003']

        const params = {
            payName: typeList[classText] ? typeList[classText].label : '',
            payTotal: percapita,
            payStartDate: now.format('yyyy-MM-dd hh:mm:ss'),
            payEndDate: endTime.format('yyyy-MM-dd hh:mm:ss'),
            payStatus: 2,
            payRemarks: remarks,
            payType: Number(classText),
            userId: this.props.userInfo.userId,
            stuIds: JSON.stringify(userList)
        }
        fetchPost(API.PAYMENT_PAYFEE, {
            paymentString: JSON.stringify(params)
        }).then(response => {
            Toast.hide()

            Toast.success('发布成功')

            this.setState({
                classText: '',
                remarks: '',
                endTime: now,
                percapita: '',
            })
        }).catch(error => {
            Toast.hide()

            if (typeof error === 'string') {
                Toast.fail(error, 2)
            } else {
                Toast.fail('数据请求异常', 2)
            }
        })
    }

    amountChange = (value) => {
        this.setState({
            percapita: value
        })
    }

    onTargetChange = (value, label, checkNodes, count) => {
        this.setState({
            targetList: value,
            targetCount: count
        });
    }

    handleClassChange = (v) => {
        console.log(v)
        this.setState({classText: v})
    }

    remarksChange = e => {
        this.setState({
            remarks: e.target.value
        })
    }

    onDateChange = date => {
        console.log(date)
        this.setState({
            endTime: date
        })
    }

}

let mapStateToProps = (state) => ({
    userInfo: {...state.redUserInfo}
})

let mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(RechargeRelease)
