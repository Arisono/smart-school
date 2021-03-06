/**
 *   Created by FANGlh on 2018/11/28 11:19.
 *   Desc:
 */

import React, {Component} from 'react';
import './MeetDetail.css';
import MeetingBean from "../../../model/MeetingBean";
import hi0_img from '../../../style/imgs/ic_head1.png';
import {Button} from 'antd';
import {fetchPost, fetchGet, fetchGetNoSession} from '../../../utils/fetchRequest';
import {API} from '../../../configs/api.config';
import {Toast} from 'antd-mobile'
import {connect} from 'react-redux';
import {isObjEmpty} from "../../../utils/common";
import {saveListState} from "../../../redux/actions/listState";

function SignItem(props) {
    return(
        <div style={{display:'flex',flexDirection:'column',margin:8,textAlign:"center"}}>
            <div> <img src={props.itemdata.userPhoto == "" || props.itemdata.userPhoto == null ? hi0_img : props.itemdata.userPhoto} alt="" style={{width:40,height:40,borderRadius:25}}/></div>
            <div  style={{fontSize:12,color:'#333333',marginTop:10}}> <span>{props.itemdata.teacherName}</span></div>
        </div>
    )
}

class MeetDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meetId: null,
            meetingBean: new MeetingBean(),
            meetingSignData: {},
            signList: [],
            unsignList: [],
            notifyStatus: null,//1是草稿 2是已发布 3是进行中 4结束
            showEndBtn: true, //是否显示结束会议按钮
        }
    }

    render() {
        const {meetingSignData} = this.state
        return (
            <div>
                <div className="comhline_sty"></div>
                <div className='signContentlayout'>
                    <div className='titleLayout'>
                        <div className='titleText'>{meetingSignData.title}</div>
                        <div className={meetingSignData.meetStatus == '进行中' ? 'meetStatusRed' : 'meetStatusGray'}>
                            {meetingSignData.meetStatus}
                        </div>
                    </div>
                    <div className='contentItem'>
                        <div className='captionText'>时间：</div>
                        <div className='valueText'>{meetingSignData.startTime + ' 到 ' + meetingSignData.endTime}</div>
                    </div>
                    <div className='contentItem'>
                        <div className='captionText'>地址：</div>
                        <div className='valueText'>{meetingSignData.address}</div>
                    </div>
                    <div className='contentItem'>
                        <div className='captionText'>发起人：</div>
                        <div className='valueText'>{meetingSignData.sponsor}</div>
                    </div>
                    <div className='bottomLayout'>
                        {/*<span className={meetingSignData.signStatus == '签到' ? 'signBtnActive' : 'signBtnEnable'}>*/}
                        {/*{meetingSignData.signStatus}*/}
                        {/*</span>*/}
                    </div>
                </div>
                <div className="comhline_sty"></div>

                <div style={{fontSize: 14, color: '#252525', marginTop: 10, marginLeft: 20}}>已签到
                    <span style={{
                        fontSize: 12,
                        color: '#666666',
                        marginLeft: 10
                    }}>({this.state.signList.length}/{this.state.signList.length + this.state.unsignList.length}人)</span>
                </div>
                <div style={{marginTop: 10, marginLeft: 20, display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                    {this.state.signList.map((itemdata, index) => <SignItem itemdata={itemdata}></SignItem>)}
                </div>
                <div className="comhline_sty1"></div>
                <div style={{fontSize:14,color:'#252525',marginTop:10,marginLeft:20}}>未签到
                    <span style={{fontSize:12,color:'#666666',marginLeft:10}}>({this.state.unsignList.length}/{this.state.signList.length+this.state.unsignList.length}人)</span>
                </div>
                <div className="comhline_sty1"></div>
                <div style={{marginTop: 10, marginLeft: 20, display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                    {this.state.unsignList.map((itemdata, index) => <SignItem itemdata={itemdata}></SignItem>)}
                </div>
                    {this.state.notifyStatus == 3 ? <div style={{textAlign:'center',marginTop:20}}>
                        <Button  className='end_sty' style={{color:'#FFFFFF',backgroundColor:'#929292'}}>已结束</Button>
                    </div> : <div style={{textAlign:'center',marginTop:20,marginBottom:20}}>
                        {this.state.showEndBtn == true ? <Button type="primary"  className='end_sty ' onClick={this.EndMeetting}>结束会议</Button> : ""}
                    </div>}
            </div>
        )
    }

    EndMeetting = () => {
        fetchPost(API.endMeeting, {
            teacherId:this.props.userInfo.userId,
            meetingId: this.state.meetId
        }, {}).then((response) => {
            console.log('response', response)
            if (response.success && response.data) {
                Toast.show(response.data, 1)
                if (this.props.listState && !isObjEmpty(this.props.listState.listData)) {
                    this.props.listState.listData[this.props.listState.itemIndex].meetStatusCode = 4
                    this.props.listState.listData[this.props.listState.itemIndex].meetStatus = '已结束'

                    saveListState({
                        listData: this.props.listState.listData,
                    })()
                }

                this.backTask = setTimeout(() => {
                    this.props.history.goBack()
                }, 1000)
            }
        }).catch((error) => {
            console.log('error', error)
            Toast.show(error.message, 1)
        })
    }

    componentWillMount() {
        document.title = '会议详情'
    }

    componentDidMount() {
        let meetId = this.props.match.params.meetId
        if (meetId == null || meetId == '') {
            return
        }
        console.log("teacherId:",this.props.userInfo.userId)
        console.log('meetId', this.props.match.params.meetId)
        let meetBean = new MeetingBean()
        meetBean.createTime = ''
        meetBean.title = ''
        meetBean.meetStatus = ''
        meetBean.startTime = ''
        meetBean.endTime = ''
        meetBean.address = ''
        meetBean.sponsor = ''
        this.setState({
            meetingSignData: meetBean,
            meetId:meetId
        })

        let params = {
            teacherId:this.props.userInfo.userId,
            meetingId: meetId
        }
        fetchPost(API.getMeetingDetails, params, {})
            .then((response) => {
                if (response.success && response.data) {
                    let meetBean1 = new MeetingBean()
                    meetBean1.createTime = response.data.createDate
                    meetBean1.title = response.data.meetingName
                    meetBean1.meetStatus = response.data.meetingSign
                    meetBean1.startTime = response.data.startDate
                    meetBean1.endTime = response.data.endDate
                    meetBean1.address = response.data.meetingAddress
                    meetBean1.sponsor = response.data.teacherName
                    let status = response.data.meetingStatus
                    if (status === 1) {
                        meetBean1.meetStatus = '未开始'
                    } else if (status === 2) {
                        meetBean1.meetStatus = '进行中'
                    } else if (status === 3) {
                        meetBean1.meetStatus = '已结束'
                    }
                    this.setState({
                        notifyId: response.data.meetingId,
                        meetingSignData: meetBean1,
                        signList: response.data.sign,
                        unsignList: response.data.unSign,
                        notifyStatus: response.data.meetingStatus
                    })
                    this.setState({
                        showEndBtn: this.props.userInfo.userId == "" ? false : this.props.userInfo.userId == response.data.meetingCreator ? true : false
                    }, function () {
                        console.log('showEndBtn', this.state.showEndBtn)
                    })
                }
            })
            .catch((error) => {
                console.log('error', error)
            })
    }

    componentWillReceiveProps(newProps) {
    }

    shouldComponentUpdate(newProps, newState) {
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    componentWillUnmount() {
        Toast.hide()
        clearTimeout(this.backTask)
    }
}

let mapStateToProps = (state) => ({
    listState: {...state.redListState},
    userInfo: {...state.redUserInfo}
})

let mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(MeetDetail)