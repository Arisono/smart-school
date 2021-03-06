import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import NotifyBoBean from 'model/NotifyBoBean'
import {List, Icon, Skeleton} from 'antd'
import NotifyBoardItem from "../../components/NotifyBoardItem";
import 'css/consume-re.css'
import {Toast, Modal, PullToRefresh} from "antd-mobile";
import {getArrayValue, getIntValue, getStrValue, isObjEmpty, isObjNull} from "../../utils/common";
import {fetchGet, fetchPost} from "../../utils/fetchRequest";
import {_baseURL, API} from "../../configs/api.config";
import ImagesViewer from "../../components/imagesVIewer";
import {connect} from 'react-redux'
import {saveListState} from "../../redux/actions/listState";

const mPageSize = 10
let mPageIndex = 0

class NotifyBoardParent extends Component {

    constructor() {
        super()

        this.state = {
            notifyList: [],
            isLoading: true,
            detailVisible: false,
            isRefreshing: false,
            height: document.documentElement.clientHeight,
            previewVisible: false
        }
    }

    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() =>
                this.setState({
                    height: hei,
                })
            , 0);
        document.title = '通知公告'

        if (this.props.listState && !isObjEmpty(this.props.listState.listData)) {
            this.setState({
                notifyList: this.props.listState.listData,
                isLoading: false,
            }, () => {
                ReactDOM.findDOMNode(this.ptr).scrollTop = this.props.listState.scrollTop
            })
            mPageIndex = this.props.listState.pageIndex
        } else {
            Toast.loading('努力加载中...', 0)
            mPageIndex = 0
            this.loadRechargeList()
        }
    }

    render() {
        const {notifyList, isLoading, isRefreshing} = this.state
        const detailModal = this.getDetailModal()

        return (
            <div className='notify-bg-root'>
                <PullToRefresh
                    direction='up'
                    refreshing={isRefreshing}
                    ref={el => this.ptr = el}
                    style={{
                        height: this.state.height,
                        overflow: 'auto',
                    }}
                    onRefresh={this.loadRechargeList}>
                    <Skeleton loading={isLoading} active paragraph={{rows: 3}}>
                        <List split={false} dataSource={notifyList}
                              renderItem={(notifyBoBean, index) => (
                                  <NotifyBoardItem notifyBoBean={notifyBoBean}
                                                   onDetailClick={this.onDetailClick.bind(this)}
                                                   index={index}/>
                              )}/>
                    </Skeleton>
                </PullToRefresh>
                {detailModal}
            </div>
        )
    }

    getDetailModal = () => {
        const {notifyList, previewVisible} = this.state

        let notifyBoBean = notifyList[this.selectIndex]

        if (isObjNull(notifyBoBean)) {
            return
        }
        let enclosureItem = <div></div>
        let pictureUrls = []
        if (!isObjEmpty(notifyBoBean.enclosure) && notifyBoBean.enclosure != '[]') {
            enclosureItem =
                <div className='principal-enclosure-layout'>
                    <img src={_baseURL + notifyBoBean.enclosure[0]}
                         className='principal-enclosure-img'
                         onClick={this.handlePreview}/>
                    <span className='principal-enclosure-count'>({notifyBoBean.enclosure.length}张)</span>
                </div>

            notifyBoBean.enclosure.forEach((enclosure, index) => {
                pictureUrls.push(_baseURL + enclosure)
            })
        }

        const receives = notifyBoBean.receiveList
        const receiveItems = []
        if (!isObjEmpty(receives) && receives != '[]') {
            for (let i = 0; i < receives.length; i++) {
                receiveItems.push(<span className='notify-detail-modal-receive'>{receives[i]}</span>)
            }

        }

        return (
            <div>
                {previewVisible ?
                    <ImagesViewer onClose={this.handleCancel} urls={pictureUrls}
                                  index={0}
                                  needPoint={pictureUrls.length <= 9}/> : ""}
                <Modal
                    popup
                    visible={this.state.detailVisible}
                    onClose={this.onModalClose}
                    animationType="slide-up">
                    <div className='notify-detail-modal-layout'>
                        <div style={{
                            width: '100%',
                            padding: '12px 14px',
                            background: 'transparent',
                            textAlign: 'right'
                        }}>
                            <Icon type="close-circle" style={{color: 'white', fontSize: '20px'}}
                                  onClick={this.onModalClose}/>
                        </div>
                        <div className='notify-detail-modal-content-layout'>
                            <div className='notify-detail-modal-content-header'>
                                <div className='notify-detail-modal-header-tilte'>{notifyBoBean.noTitle}</div>
                                {/* <span
                                className={notifyBoBean.noStatu === '已读' ?
                                    'notify-item-statuAl' : 'notify-item-statuNo'}>{notifyBoBean.noStatu}</span>*/}
                            </div>
                            <div className='notify-detail-modal-content-text'>{notifyBoBean.noContent}</div>
                            <div style={{padding: '10px'}}>
                                {enclosureItem}
                            </div>
                            <div className='notify-detail-modal-time'>{notifyBoBean.noIssue}</div>
                            <div className='notify-detail-modal-time'>{notifyBoBean.noTime}</div>
                            {/*<div className='gray-line'></div>
                        <div className='common-flex-row-10 common-font-family'>
                            <span style={{color: '#363636'}}>接收人</span>
                            <div style={{flex: '1', textAlign: 'right'}}>
                                <span style={{fontSize: '12px', color: '#CD1D1D'}}>未读：{notifyBoBean.unRead}</span>
                                <span style={{
                                    fontSize: '12px',
                                    color: '#161616',
                                    marginLeft: '10px'
                                }}>已读：{notifyBoBean.readed}</span>
                            </div>
                        </div>
                        <div>
                            {receiveItems}
                        </div>*/}
                        </div>
                    </div>
                </Modal>
            </div>

        )
    }

    onModalClose = () => {
        this.setState({
            detailVisible: false
        })
    }


    onDetailClick = (index) => {
        const {notifyList} = this.state
        this.selectIndex = index

        notifyList[index].noStatu = '已读'
        this.setState({
            notifyList
        })

        saveListState({
            scrollTop: ReactDOM.findDOMNode(this.ptr).scrollTop,
            listData: this.state.notifyList,
            pageIndex: mPageIndex,
        })()

        this.props.history.push('/notifyDetail/' + notifyList[index].noId)

        /*Toast.loading('', 0)
        fetchGet(API.TASK_DETAIL, {
            notifyId: notifyList[index].noId,
            userId: this.props.userInfo.userId,
        }).then(response => {
            Toast.hide()
            if (response && response.data) {
                let item = response.data
                if (notifyList && notifyList[index]) {
                    let notifyBoBean = notifyList[index]

                    notifyBoBean.noId = getIntValue(item, 'notifyId')
                    notifyBoBean.noTitle = getStrValue(item, 'notifyName')
                    notifyBoBean.enclosure = getArrayValue(item, 'enclosure')
                    if (item.notifyRecords) {
                        notifyBoBean.unRead = getArrayValue(item.notifyRecords, 'unReads')
                        notifyBoBean.readed = getArrayValue(item.notifyRecords, 'reads')
                    }
                    notifyBoBean.noContent = getStrValue(item, 'notifyDetails')
                    notifyBoBean.noIssue = getStrValue(item, 'notifyCreatorName')
                    notifyBoBean.noTime = getStrValue(item, 'creatDate')
                    notifyBoBean.noStatu = '已读'
                }

                this.setState({
                    notifyList,
                    detailVisible: true
                })
            }
        }).catch(error => {
            Toast.hide()
            if (typeof error === 'string') {
                Toast.fail(error)
            }
        })*/
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

        const {notifyList} = this.state
        if (mPageIndex === 1) {
            notifyList.length = 0
        }

        fetchPost(API.notifyMessage, {
            userId: this.props.userInfo.userId,
            notifyType: 4,
            pageIndex: mPageIndex,
            pageSize: mPageSize
        }).then(response => {
            Toast.hide()
            if (response && response.data && response.data.notify.length > 0) {
                response.data.notify.forEach((item, index) => {
                    let notifyBoBean = new NotifyBoBean()

                    notifyBoBean.noId = getIntValue(item, 'notifyId')
                    notifyBoBean.noTitle = getStrValue(item, 'notifyName')
                    notifyBoBean.enclosure = getArrayValue(item, 'enclosure')
                    if (item.notifyRecords) {
                        notifyBoBean.unRead = getArrayValue(item.notifyRecords, 'unReads')
                        notifyBoBean.readed = getArrayValue(item.notifyRecords, 'reads')
                    }
                    notifyBoBean.noContent = getStrValue(item, 'notifyDetails')
                    notifyBoBean.noIssue = getStrValue(item, 'notifyCreatorName')
                    notifyBoBean.noTime = getStrValue(item, 'creatDate')

                    if (getIntValue(item, 'isRead') == 1) {
                        notifyBoBean.noStatu = '未读'
                    } else {
                        notifyBoBean.noStatu = '已读'
                    }

                    notifyList.push(notifyBoBean)
                })
            } else {
                if (mPageIndex > 1) {
                    mPageIndex--
                }
            }
            this.setState({
                notifyList,
                isLoading: false,
                isRefreshing: false,
            })

        }).catch(error => {
            Toast.hide();

            if (mPageIndex > 1) {
                mPageIndex--
            }
            this.setState({
                isLoading: false,
                isRefreshing: false
            })
            if (typeof error === 'string') {
                Toast.fail(error, 2)
            }
        })
    }

    handlePreview = () => {
        this.setState({
            previewVisible: true,
        });
    }

    handleCancel = () => this.setState({previewVisible: false})
}


let mapStateToProps = (state) => ({
    userInfo: {...state.redUserInfo},
    listState: {...state.redListState}
})

let mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(NotifyBoardParent)
