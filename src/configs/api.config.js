import {fetchGet} from "../utils/fetchRequest";
import {isObjEmpty} from "../utils/common";
import {switchUser} from "../redux/actions/userInfo";
import store from './../redux/store/store'

/**
 * Created by RaoMeng on 2018/11/21
 * Desc: 项目接口
 */
// export const _baseURL = 'https://tmobile.ubtob.com/school'
// export const _baseURL = 'http://10.1.80.101:8080/school'
export const _baseURL = 'http://10.1.80.101:9600'
export const API = {
    //获取验证码
    SEND_CODE: _baseURL + '/user/sendCode',
    //获取openId
    GET_OPENID: _baseURL + '/wxPay/getOpenid',
    //绑定学号
    BIND_STUDENTID: _baseURL + '/user/bindStudentId',
    //绑定工号
    BIND_TEACHERID: _baseURL + '/user/bindTeacherId',
    //3作业发布 4通知公告 5 校长信箱 6会议
    GET_MEETING_LIST: _baseURL + '/notify/getMeetingList',
    //1系统信息 2使用帮助
    SYSTEM_MESSAGE: _baseURL + '/notify/systemMessage',
    //获取班级列表
    GET_CLASS_LIST: _baseURL + '/school/getClassList',
    //获取班级相册列表
    GET_ALBUM_LIST: _baseURL + '/picture/getAlbumList',
    //获取相册内所有图片
    GET_PICTURE_LIST: _baseURL + '/picture/getPictureList',
    //文件上传地址
    UPLOAD_FILE: _baseURL + '/file/uploadFile',
    //修改相册
    UPDATE_ALBUM: _baseURL + '/picture/updateAlbum',
    //删除附件
    DELETE_FILE: _baseURL + '/picture/deleteFile',
    //新建相册
    NEW_CLASS_ALBUM: _baseURL + '/picture/newClassAlbum',
    //视频上传
    INSERT_VIDEO: _baseURL + '/picture/insertVideo',
    //作业 /会议/通知等详情
    TASK_DETAIL: _baseURL + '/notify/taskDetail',
    //发布通知公告/发布作业/创建会议
    ISSUE_NOTIFICATION: _baseURL + '/notify/issueNotification',
    //发布缴费
    PAYMENT_PAYFEE: _baseURL + '/payment/payFee',
    //收费列表家长端
    PAYMENT_PAYMENTLIST: _baseURL + '/payment/paymentList',
    //收费列表教师端
    PAYMENT_PAYMENTLIST_TEACHER: _baseURL + '/payment/paymentListByUserId',
    //收费详情
    PAYMENT_PAYMENT_DETAIL: _baseURL + '/payment/paymentDetails',
    //结束收款
    PAYMENT_ENTPAY: _baseURL + '/payment/endPay',
    //获取所有老师的电话
    TEACHER_PHONES_LIST: _baseURL + '/user/getTeacherPhoneList',
    //获取相应班级老师电话号码
    GET_TEACHER_PHONES: _baseURL + '/user/getTeacherPhones',
    //获取班级家长手机号
    GET_PARENT_PHONES: _baseURL + '/user/getParentPhones',

    //校长信箱提交
    PRINCIPAL_MAILBOX: _baseURL + '/notify/principalMailbox',
    //校园卡充值
    RECHARGE_FORCARD: _baseURL + '/payCard/reChangeForCard',
    //校园卡详情
    CARD_DETAIL: _baseURL + '/payCard/cardDetail',
    //校园卡消费记录/充值记录
    CONSUME_RECODE: _baseURL + '/payRank/consumeRecode',
    //获取用户是否绑定
    USER_ISBINDING: _baseURL + '/user/isBinding',
    //获取组织架构
    USER_GETOBJECT: _baseURL + '/user/getObject',
    //删除校长信箱历史投递
    NOTIFY_DELETEMAIL: _baseURL + '/notify/deleteMail',
    //修改学生人脸照
    UPDATE_STU_PHOTO: _baseURL + '/user/updateStuPhoto',


    //根据学号取课程表
    curriculumListByStuId: _baseURL + '/curriculum/curriculumListByStuId',
    //查询学生出入校记录
    RecordOutgoingList: _baseURL + '/recordOutgoing/RecordOutgoingList',
    //分页显示会议 /分页显示作业 /分页显示通知
    notifyMessage: _baseURL + '/notify/getMeetingList',


    //首页接口
    homeIndex: _baseURL + "/wxSchool/user/homePage",
    //创建投票单
    voteCreate: _baseURL + '/vote/voteCreate',//投票创建
    voteList: _baseURL + "/vote/voteList",//家长端
    voteListTeacher: _baseURL + "/vote/voteListForTeacher",//教师端
    voteDetail: _baseURL + "/vote/voteDetail",//投票详情
    voteAction: _baseURL + "/vote/voteAction",//投票
    //发布作业
    homeWorkAdd: _baseURL + "/notify/issueNotification",
    homeWorkList: _baseURL + "/notify/getMeetingList",
    homeWorkDetail: _baseURL + "/notify/taskDetail",
    //留言功能
    messageCreate: _baseURL + "/leaveMessage/messageCreate",
    messageList: _baseURL + "/leaveMessage/getMessageListByNotifyId",
    //学生请假
    leaveCreate: _baseURL + "/leave/leaveCreate",
    leaveListParent: _baseURL + "/leave/leaveListByStuId",
    leaveListTeacher: _baseURL + "/leave/leaveListByUserId",
    //学生请假单详情
    leaveDetail: _baseURL + "/leave/lvDetail",
    //发布通知公告/发布作业/创建会议
    issueNotification: _baseURL + '/notify/issueNotification',
    //成绩查询
    getScoreByStuId: _baseURL + '/score/getScoreByStuId',

    //OA单据创建
    oaCreate: _baseURL + '/wxSchool/oaApprove/oaCreate',
    //审批列表
    oaApproveList: _baseURL + '/wxSchool/oaApprove/oaList',
    //审批操作
    doapprove: _baseURL + '/wxSchool/oaApprove/approve',
    //审批单详情
    oaDetails: _baseURL + '/wxSchool/oaApprovee/oaDetails',

    //获取分值条件
    getCurr: _baseURL + '/score/getCurr',


    //TODO 接口修改后的
    // 获取抄送老师
    getAllTeacher:_baseURL + '/wxSchool/user/getAllTeacher',
    //创建会议
    createMeeting:_baseURL + '/wxSchool/meeting/createMeeting',
    //会议列表
    meetingList:_baseURL + '/wxSchool/meeting/meetingList',
    //会议详情
    getMeetingDetails:_baseURL + '/wxSchool/meeting/getMeetingDetails',
    //结束会议
    endMeeting: _baseURL + '/wxSchool/meeting/endMeeting',
    //会议签到
    MEETING_SIGN: _baseURL + '/wxSchool/meeting/meetingSign',
    //删除会议
    deleteMeeting:_baseURL + '/wxSchool/meeting/deleteMeeting',
}



