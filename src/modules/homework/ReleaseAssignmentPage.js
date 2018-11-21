/**
 * Created by Arison on 2018/11/6.
 */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import  './ReleaseAssignmentPage.css'
import { Input,Button , DatePicker } from 'antd';
import PicturesWallItem from "../../components/upload/PicturesWallItem";
import {Icon} from "antd";
const { TextArea } = Input;
/**
 * 发布作业
 * Created by Arison on 17:47.
 */
class ReleaseAssignmentPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            name:'ReleaseAssignmentPage'
        };
    }

    callback(msg){
        console.log("leaveAddPage:callback："+JSON.stringify(msg));
    }

    componentDidMount(){

    }

    render(){
        return <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <div className="row" id="page_block_min"></div>
                    <div className="row">
                        <div className="col-xs-6" id="page_tile"><span>发布对象</span><span>(共15人)</span></div>
                    </div>
                    <div className="row" id="page_horizontal_line"></div>
                    <div className="row flex_center" id="row_center">
                        <div className="col-xs-11" id="row_padding">
                            <span id="list_data_span">王二</span>
                            <span id="list_data_span">王二</span>
                            <span id="list_data_span">王二</span>
                            <span id="list_data_span">王二</span>
                            <span id="list_data_span">王二</span>
                            <span id="list_data_span">王二</span>
                        </div>
                        <div className="col-xs-1 flex_center">
                            <Icon  type="plus-circle" style={{color:'#4FB2FE',fontSize:"25px"}}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row" id="page_block_max"></div>
            <div className="row">
                <div className="col-xs-12">
                    <div className="row  flex_center" >
                        <div className="col-xs-4 flex_center"><span   id="page_tile">截止时间</span></div>
                        <div className="col-xs-8  flex_center margin_top_bottom_10"  >
                            <span id="span-lager">
                                <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder=""

                            /></span>

                        </div>
                    </div>
                </div>
            </div>
            <div className="row" id="page_block_max"></div>
            <div className="row" id="row_padding_height">
                <div className="col-xs-12">
                    <div className="row">
                    <Input placeholder="请输入作业名称" style={{paddingLeft:"28px",fontSize:"18px"}}  id="input_no_border"/>
                    </div>
                    <div className="row">
                        <div  id="page_horizontal_line"></div>
                    </div>
                    <div className="row">
                        <TextArea rows={4} style={{paddingLeft:"28px",paddingTop:"20px"}} placeholder="请输入作业内容" id="input_no_border"/>
                    </div>
                </div>
            </div>
            <div className="row" id="page_block_min"></div>
            <div className="row">
                    <div className="col-xs-12">
                        <div className="row"><div className="col-xs-6" id="page_tile">附件</div></div>
                        <div className="row" id="row_padding_with" >
                            <PicturesWallItem action={'url路径'} number={1} callback = { this.callback.bind(this)}></PicturesWallItem>

                        </div>
                        <div className="row flex_row flex_center margin_top_20" >
                            <Button type="primary" size="large"  block><span id="span-lager">发 布 作 业</span></Button>
                        </div>
                        <div id="row_center"><span id="link_href" >历史发布</span></div>
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