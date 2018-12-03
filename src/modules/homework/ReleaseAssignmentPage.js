/**
 * Created by Arison on 2018/11/6.
 */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import  './ReleaseAssignmentPage.css'
import '../../style/css/app-gloal.css'
import { Input,Button , DatePicker,Icon,message } from 'antd';
import PicturesWallItem from "../../components/upload/PicturesWallItem";
import TargetSelect from "../../components/TargetSelect";
import {fetchPost,fetchGet} from '../../utils/fetchRequest';
import {API} from '../../configs/api.config';
import {isObjEmpty} from  '../../utils/common';


const { TextArea } = Input;
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

for (let i = 1; i < 10; i++) {
    teacherData.push({
        title: `老师${i}`,
        value: `1-${i}`,
        key: `1-${i}`,
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
/**
 * 发布作业
 * Created by Arison on 17:47.
 */
class ReleaseAssignmentPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name: 'ReleaseAssignmentPage',
            targetList: ['1-1'],
            targetCount: 1,
            data:{
                notifyName: '',//标题
                notifyType: '3',//作业发布
                notifyDetails: '',//内容
                notifyCreator: '10000',//创建者
                notifyStatus: '2',//状态  2发布  1草稿
                userIds: '10001,10002,10003',//通知
                notifyFiles: [],
                startDate: '',//当前时间
                endDate: null//截止时间
            }

        }
    }

      componentWillMount(){
              document.title ="发布作业";
         }

    callback=(file,fileList)=>{
        console.log("leaveAddPage:callback：",fileList);
        this.state.data.notifyFiles.length=0;
        for (let i = 0; i < fileList.length; i++) {
            if(fileList[i].status==="done"){
                this.state.data.notifyFiles.push(fileList[i].response.data)
            }
        }
        console.log("callback()", this.state.data.notifyFiles);
    }

    handleRemove=(file)=>{

    }

    componentDidMount(){

    }


    changeName=(value)=>{
                console.log("changeName():"+value.target.value);
                this.setState({
                    data:{
                        notifyName: value.target.value,//标题
                        notifyType: '3',//作业发布
                        notifyDetails: this.state.data.notifyDetails,//内容
                        notifyCreator: '10000',//创建者
                        notifyStatus: '2',//状态  2发布  1草稿
                        userIds: '10001,10002,10003',//通知
                        notifyFiles: [],
                        startDate: '',//当前时间
                        endDate: this.state.data.endDate//截止时间
                    }
                })

                console.log("changeName():"+JSON.stringify(this.state.targetList));
    }

    changeContent=(value)=>{
        console.log("changeName():"+value.target.value);
        this.setState({
            data:{
                notifyDetails: value.target.value,//标题
                notifyName: this.state.data.notifyName,//标题
                notifyType: '3',//作业发布
                notifyCreator: '10000',//创建者
                notifyStatus: '2',//状态  2发布  1草稿
                userIds: '10001,10002,10003',//通知
                notifyFiles: [],
                startDate: '',//当前时间
                endDate: this.state.data.endDate//截止时间
            }
        })
    }
    changeEndDateOk=(value)=>{
        console.log("changeName():"+value);
        if(isObjEmpty(value)){
            message.info("请选择日期");
            return
        }
    }

    changeEndDate=(value,dateString)=>{
        console.log("changeName():"+value);
        console.log("changeName():"+dateString);
        this.setState({
            data:{
                notifyDetails: this.state.data.notifyDetails,//标题
                notifyName: this.state.data.notifyName,//标题
                notifyType: '3',//作业发布
                notifyCreator: '10000',//创建者
                notifyStatus: '2',//状态  2发布  1草稿
                userIds: '10001,10002,10003',//通知
                notifyFiles: [],
                startDate: '',//当前时间
                endDate: dateString,//标题
            }
        })
    }

    onTargetChange = (value, label, checkNodes, count) => {
        this.setState({
            targetList: value,
            targetCount: count
        });
    }

    commitAction=()=>{
        console.log("commitAction()"+this.state.data.notifyName);
        console.log("commitAction()"+this.state.data.notifyDetails);
        console.log("commitAction()"+this.state.data.endDate);
         if(isObjEmpty(this.state.data.notifyName)){
              message.info("请输入作业名称");
             return;
         }
        if(isObjEmpty(this.state.data.notifyDetails)){
            message.info("请输入作业内容");
            return;
        }
        if(isObjEmpty(this.state.data.endDate)){
            message.info("请输入截止时间");
            return;
        }
        fetchPost(API.homeWorkAdd,{
            notifyName:this.state.data.notifyName,//标题
            notifyType:'3',//作业发布
            notifyDetails:this.state.data.notifyDetails,//内容
            notifyCreator:'10000',//创建者
            notifyStatus:'2',//状态
            endDate:this.state.data.endDate,
            userIds:'10001,10002,10003',
            notifyFiles:this.state.data.notifyFiles
        }).then((response)=>{
            console.log("response:"+JSON.stringify(response));
            if (response.success){
                 message.info("发布成功！")
            }
        }).catch((error)=>{
            console.log("error:"+JSON.stringify(error));
        })
    }

    goListAction=()=>{
        this.props.history.push("/assignmentList/teacher");
    }

    render(){
        const { targetCount, targetList} = this.state
        const targetProps = {
            placeholder: '请选择抄送对象',
            targetData: targetData,
            targetValues: targetList,
            title: '抄送对象',
            targetCount: targetCount,
            onTargetChange: this.onTargetChange.bind(this)
        }
        return <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="row" id="page_block_min"></div>
                    <div className="row">
                        <TargetSelect   {...targetProps}></TargetSelect>
                    </div>
                </div>
            </div>
            <div className="row" id="page_block_max"></div>
            <div className="row">
                <div className="col-xs-12">
                    <div className="row flex_center_vertical"  >
                        <div className="margin_left_right_10"><span   id="page_tile">截止时间</span></div>
                        <div className="item_flex
                        flex_row_right
                        margin_top_bottom_10
                        margin_left_right_10"  style={{marginRight:"10px"}}>
                            <DatePicker
                                showTime
                                defaultValue={this.state.data.endDate}
                                onChange={this.changeEndDate}
                                format="YYYY-MM-DD HH:mm:ss"
                                onOk={this.changeEndDateOk}
                                placeholder=""/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row" id="page_block_max"></div>
            <div className="row" id="row_padding_height">
                <div className="col-xs-12">
                    <div className="row">
                    <Input placeholder="请输入作业名称"  defaultValue={this.state.data.notifyName}
                           style={{paddingLeft:"28px",fontSize:"18px"}}
                           onChange={this.changeName}
                           id="input_no_border"/>
                    </div>
                    <div className="row">
                        <div  id="page_horizontal_line"></div>
                    </div>
                    <div className="row">
                        <TextArea rows={4}
                                  value={this.state.data.notifyDetails}
                                  onChange={this.changeContent}
                                  style={{paddingLeft:"28px",paddingTop:"20px"}}
                                  placeholder="请输入作业内容"
                                  id="input_no_border"/>
                    </div>
                </div>
            </div>
            <div className="row" id="page_block_min"></div>
            <div className="row">
                    <div className="col-xs-12">
                        <div className="row"><div className="col-xs-6" id="page_tile">附件</div></div>
                        <div className="row" id="row_padding_with" >
                            <PicturesWallItem
                                action={API.UPLOAD_FILE}
                                number={4}
                                callback = { this.callback.bind(this)}>
                                handleRemove={this.handleRemove.bind(this)}
                            </PicturesWallItem>


                        </div>
                        <div className="row flex_row flex_center margin_top_20" >
                            <Button type="primary"  onClick={this.commitAction} size="large"  block><span id="span-lager">发 布 作 业</span></Button>
                        </div>
                        <div id="row_center" onClick={this.goListAction}><span id="link_href" >历史发布</span></div>
                        <div id="bottom_height"></div>
                    </div>
            </div>
            <div className="row">

            </div>
            <div className="row"></div>
            <div className="row"></div>
            <div className="row"></div>
        </div>
    }
}

export  default ReleaseAssignmentPage;