<template>
	<div>
		<div>
			<el-button v-on:click="test">测试按钮</el-button>
		</div>

		<!-- 操作 -->
		<div>
			<el-button v-on:click="initDatabase">初始化数据库</el-button>
			<el-button v-on:click="open">打开设备</el-button>
			<el-button v-on:click="read">读取设备</el-button>
			<label>设备状态:</label><label>{{ status }}</label>
		</div>

		<el-form ref="form" :model="form" label-width="80px">
			<el-form-item label="姓名">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="身份证">
				<el-input v-model="form.idCard"></el-input>
			</el-form-item>
		</el-form>

		<!-- 表格 -->
		<div>
			<el-input
				placeholder="请输入内容"
				prefix-icon="el-icon-search"
				v-model="keyword"
				@change="search"
			>
			</el-input>
			<el-table :data="users" style="width: 100%">
				<el-table-column prop="userName" label="姓名" width="180" />
				<el-table-column prop="idCard" label="身份证号" width="180" />
				<el-table-column prop="qrCode" label="二维码" width="180" />
				<el-table-column prop="dateTime" label="日期" width="180" />
				<el-table-column fixed="right" label="操作" width="150">
					<template #default="scope">
						<el-row>
							<el-button
								type="primary"
								size="small"
								@click="edit(scope.row)"
								>编辑</el-button
							>
							<el-button
								size="small"
								type="danger"
								@click="deleteUser(scope.row)"
								>删除</el-button
							>
						</el-row>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				layout="prev, pager, next"
				:total="pageInfo.total"
				:page-size="pageInfo.pageSize"
				@current-change="userListWithPageInfo"
			>
			</el-pagination>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { openDevice, readDevice, closeDevice } from '@/api/idCard'
import '@/db/sequelize'
import User from '@/model/user'
import { initDB } from '@/db/init'
import { interval } from 'rxjs'
import dayjs from 'dayjs'
import '@/serialport/serialport'

export default {
	name: "Home",
	components: {
	},
	mounted: async function () {
		await this.baseUserList(this.pageInfo.currentPage, this.pageInfo.pageSize, this.keyword)
	},
	methods: {
		async edit (user) {
			console.log('编辑:', user)
			await user.update({ 'qrCode': '二维码' })
		},
		async test () {
			console.log("测试")
			interval(1000).subscribe(async () => {
				await this.read()
			})
		},
		async open () {
			const { data } = await openDevice()
			const { errorMsg: msg } = data
			this.status = msg
		},
		async read () {
			const result = await readDevice()
			const { data } = result
			const { partyName, certNumber, errorMsg, resultFlag } = data
			this.form.name = partyName
			this.form.idCard = certNumber
			if (errorMsg) {
				this.status = errorMsg
			}
			if (resultFlag === 0) {
				await this.insertUser()
			}
		},
		async close () {
			const { data } = await closeDevice()
			const { errorMsg: msg } = data
			this.status = msg
		},
		async initDatabase () {
			await initDB()
		},
		async insertUser () {
			// const user = await User.findAll({
			// 	idCard: this.idCard
			// })
			// if (user) {
			// 	alert("不能重复添加")
			// } else {

			// }
			if (!this.form.name || !this.form.idCard) {
				alert('信息不能为空')
				return
			}
			const dateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
			await User.create({
				userName: this.form.name,
				idCard: this.form.idCard,
				dateTime
			})
			await this.userListWithPageInfo(this.pageInfo.currentPage)
		},
		async deleteUser (user) {
			await user.destroy()
			await this.userListWithPageInfo(this.pageInfo.currentPage)
		},
		async updateUser (user) {
			await user.update({ qrCode: '二维码' })
		},
		async userListWithPageInfo (currentPage) {
			await this.baseUserList(currentPage, this.pageInfo.pageSize)
		},
		async baseUserList (page, limit, keyword) {
			const result = await User.list(page, limit, keyword)
			console.log('result =', result)
			this.pageInfo = result.pageInfo
			this.users = result.items
		},
		async search (keyword) {
			console.log('关键字：', keyword)
			this.keyword = keyword
			const result = await User.list(this.pageInfo.currentPage, this.pageInfo.pageSize, keyword)
			console.log('result =', result)
			this.pageInfo = result.pageInfo
			this.users = result.items
		}
	},
	data () {
		return {
			status: '',
			keyword: '',
			users: [],
			form: {
				name: '',
				idCard: '',
			},
			pageInfo: {
				pageSize: 8,
				total: 0,
				currentPage: 1
			}
		}
	}
};
</script>
