/**
 * Created by RaoMeng on 2018/11/6
 * Desc: 账号绑定
 */

import React, {Component} from 'react'
import 'css/account-bind.css'
import {Avatar, Input, Icon, Button} from 'antd'
import {fetchGet, fetchPost} from "../../utils/fetchRequest";
import {API} from "../../configs/api.config";
import {getIntValue, getStrValue, isObjEmpty} from "../../utils/common";
import {Toast} from 'antd-mobile'
import {regExpConfig} from "../../configs/regexp.config";
import {connect} from 'react-redux'
import {switchUser} from "../../redux/actions/userInfo";

let mType = 'parents'
let mSeconds = 0

class AccountBind extends Component {

    componentWillMount() {
        this.bodyHeight = document.documentElement.clientHeight
        if (this.props.match.params.type) {
            mType = this.props.match.params.type
        }

        if (mType == 'parents') {
            document.title = '家长端绑定'
        } else if (mType == 'teacher') {
            document.title = '教职工端绑定'
        }

    }

    constructor() {
        super()
        this.state = {
            account: '',
            phone: '',
            code: '',
            obtainText: '获取验证码',
            userHead: 'http://d.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=1be47219c1fdfc03e52debbce10faba2/b8389b504fc2d562562d540ae51190ef76c66c34.jpg'
        }
    }

    render() {
        const {account, phone, code, obtainText, userHead} = this.state

        const idClear = account ?
            <Icon type="close-circle" onClick={this.accountEmpty} style={{color: 'white'}}/>
            : null;
        const phoneClear = phone ?
            <Icon type="close-circle" onClick={this.phoneEmpty} style={{color: 'white'}}/>
            : null;
        const codeClear = code ?
            <Icon type="close-circle" onClick={this.codeEmpty} style={{color: 'white'}}/>
            : null;
        const idIcon = <img src={require('imgs/ic_account_input.png')} className='inputIcon1'/>
        const phoneIcon = <img src={require('imgs/ic_phone_input.png')} className='inputIcon2'/>
        const codeIcon = <img src={require('imgs/ic_code_input.png')} className='inputIcon3'/>

        const obtainCode = <div onClick={this.obtainCode}>{obtainText}</div>

        return (
            <div className='bindParent' style={{height: this.bodyHeight + 'px'}}>
                <div className='bindHeadLayout'>
                    {isObjEmpty(userHead) ?
                        <Avatar icon='user' size={65}/> :
                        <Avatar src={userHead} size={65}/>}
                </div>
                <Input placeholder={mType == 'parents' ? '学号' : '工号'}
                       prefix={idIcon} suffix={idClear}
                       ref={input => this.accountInput = input} onChange={this.accountChange}
                       value={account} type='number' onKeyPress={this.phoneKeyPress}/>
                <Input placeholder='手机号' prefix={phoneIcon} suffix={phoneClear}
                       ref={input => this.phoneInput = input} onChange={this.phoneChange}
                       value={phone} type='number' onKeyPress={this.phoneKeyPress}
                       addonAfter={obtainCode}/>
                <Input placeholder='短信验证码' prefix={codeIcon} suffix={codeClear}
                       ref={input => this.codeInput = input} onChange={this.codeChange}
                       value={code} type='number' onKeyPress={this.phoneKeyPress}/>

                <Button type="primary" block className='commonButton' style={{marginTop: '35px'}}
                        onClick={this.bindEvent}>绑定</Button>
            </div>
        );
    }

    phoneKeyPress = (event) => {
        const invalidChars = ['-', '+', 'e', '.', 'E']
        if (invalidChars.indexOf(event.key) !== -1) {
            event.preventDefault()
        }
    }

    accountChange = (e) => {
        this.setState({
            account: e.target.value
        })
    }

    phoneChange = (e) => {
        this.setState({
            phone: e.target.value
        })
    }

    codeChange = (e) => {
        this.setState({
            code: e.target.value
        })
    }

    accountEmpty = () => {
        this.accountInput.focus()
        this.setState({
            account: ''
        })
    }

    phoneEmpty = () => {
        this.phoneInput.focus()
        this.setState({
            phone: ''
        })
    }

    codeEmpty = () => {
        this.codeInput.focus()
        this.setState({
            code: ''
        })
    }

    obtainCode = () => {
        if (mSeconds !== 0) {
            return
        }
        const {phone} = this.state
        if (isObjEmpty(phone)) {
            Toast.info('请输入手机号码!', 2, null, false)
            return
        }
        if (!regExpConfig.mobile.test(phone)) {
            Toast.fail('请输入正确的手机号码!', 2, null, false)
            return
        }
        Toast.loading('验证码获取中...', 0)
        this.setState({
            obtainText: '获取中'
        })
        fetchGet(API.SEND_CODE, {
            userPhone: phone
        }).then(response => {
            Toast.hide()
            if(response.success){
                Toast.success('验证码已发送，请注意查收', 2)
                mSeconds = 60
                this.setState({
                    obtainText: '剩余' + mSeconds + '秒'
                })
                this.countdown()
            }else {
                Toast.fail(response.data.message, 2)
            }
        }).catch(error => {
            Toast.hide()
            this.setState({
                obtainText: '获取验证码'
            })
            Toast.fail(error || '获取验证码失败', 2)
        })
    }

    countdown = () => {
        setTimeout(() => {
            if (mSeconds > 0) {
                mSeconds--
                this.setState({
                    obtainText: '剩余' + mSeconds + '秒'
                })
                this.countdown()
            } else {
                this.setState({
                    obtainText: '获取验证码'
                })
            }
        }, 1000)
    }

    bindEvent = () => {
        Toast.loading('信息绑定中...')
        const {account, phone, code, userHead} = this.state
        if (isObjEmpty(account, phone, code)) {
            Toast.fail('请完善所有输入项！')
            return
        }
        if (mType == 'parents') {
            fetchPost(API.BIND_STUDENTID, {
                stuId: account,
                userPhone: phone,
                vcode: code,
                openid: this.props.userInfo.userOpenid,
                userPhoto: userHead
            }).then(response => {
                Toast.hide()
                switchUser({
                    userId: getIntValue(response.data, 'userId'),
                    userName: getStrValue(response.data, 'userName'),
                    userOpenid: getStrValue(response.data, 'userOpenid'),
                    userPhone: getStrValue(response.data, 'userPhone'),
                    userAvatar: userHead,
                    userRole: 1,
                })()
                this.props.history.push('/homePage')
            }).catch(error => {
                Toast.hide()

                if (typeof error === 'string') {
                    Toast.fail(error, 2)
                } else {
                    Toast.fail('绑定学号失败')
                }
            })
        } else if (mType == 'teacher') {
            fetchPost(API.BIND_TEACHERID, {
                userId: account,
                userPhone: phone,
                vcode: code,
                openid: this.props.userInfo.userOpenid,
                userPhoto: userHead
            }).then(response => {
                Toast.hide()
                switchUser({
                    userId: getIntValue(response.data, 'userId'),
                    userName: getStrValue(response.data, 'userName'),
                    userOpenid: getStrValue(response.data, 'userOpenid'),
                    userPhone: getStrValue(response.data, 'userPhone'),
                    userAvatar: userHead,
                    userRole: 2,
                })()
                this.props.history.push('/homePage')
            }).catch(error => {
                Toast.hide()

                if (typeof error === 'string') {
                    Toast.fail(error, 2)
                } else {
                    Toast.fail('绑定工号失败')
                }
            })
        }
    }

}

let mapStateToProps = (state) => ({
    userInfo: {...state.redUserInfo}
})

let mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(AccountBind)