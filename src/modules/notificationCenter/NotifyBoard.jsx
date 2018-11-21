import React, {Component} from 'react'
import NotifyBoBean from 'model/NotifyBoBean'
import {List, Icon, Skeleton} from 'antd'
import InfiniteScroll from 'react-infinite-scroller'
import LoadingMore from 'components/LoadingMore'
import NotifyBoardItem from "../../components/NotifyBoardItem";
import 'css/consume-re.css'
import {Toast} from "antd-mobile";


export default class NotifyBoard extends Component {

    constructor() {
        super()

        this.state = {
            notifyList: [],
            hasMoreData: true,
            isLoading: true

        }
    }

    componentDidMount() {

        document.title = '通知公告'
        Toast.loading('努力加载中...', 0)

    }

    render() {
        const {notifyList, hasMoreData, isLoading} = this.state

        return (
            <div className='notify-bg-root'>
                <div className='displayNone'></div>
                <div className='displayNone'></div>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadRechargeList}
                    hasMore={hasMoreData}
                    loader={<LoadingMore/>}>
                    <Skeleton loading={isLoading} active paragraph={{rows: 3}}>
                <List className='notifyBoBean-list-layout'
                      split={false} dataSource={notifyList}
                      renderItem={notifyBoBean => (
                          <NotifyBoardItem notifyBoBean={notifyBoBean}/>
                      )}/>
                    </Skeleton>
                </InfiniteScroll>
                <Icon type="plus-circle" theme='filled' className='common-add-icon'
                      onClick={this.onAddNotify}/>
            </div>
        )
    }

    loadRechargeList = () => {
        setTimeout(() => {
            Toast.hide()
            const {notifyList} = this.state
            for (let i = 0; i < 20; i++) {
                let notifyBoBean = new NotifyBoBean()

                notifyBoBean.noTitle = '2019春季校运会'
                if (i % 2 === 0) {
                    notifyBoBean.noStatu = '已读'
                } else {
                    notifyBoBean.noStatu = '未读'
                }
                notifyBoBean.noContent = ' 尊敬的家长和尊敬的各位来宾，你们好，我校将在10月25号举办校园运动会，请各位家长们积极配合校园运动会的工作的开展'

                notifyBoBean.noIssue = '周老师'

                notifyBoBean.noTime = '2019-20-20 28:00'

                notifyList.push(notifyBoBean)
            }

            this.setState({
                notifyList: this.state.notifyList,
                isLoading: false
            })
        }, 1500)
    }


    onAddNotify = () => {
        this.props.history.push('/announceRelease')
    }
}