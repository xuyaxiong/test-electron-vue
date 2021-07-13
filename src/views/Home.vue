<template>
	<div>
		<div>
			<button v-on:click="test">测试</button>
		</div>
		<div>
			<button v-on:click="open">打开</button>
			<button v-on:click="read">读取</button>
			<button v-on:click="close">关闭</button>
			<label>设备状态:</label><label>{{ status }}</label>
		</div>
		<div>
			<label>姓名：</label
			><input readonly="readonly" v-bind:value="name" />
			<br />
			<label>身份证号：</label
			><input readonly="readonly" v-bind:value="idCard" />
		</div>
		<div>
			<button v-on:click="initDatabase">初始化数据库</button>
			<button v-on:click="insertUser">插入用户数据</button>
			<button v-on:click="userList">查询用户列表</button>
		</div>
		<div>
			<ul>
				<li v-for="user in users" :key="user.id">
					{{ user.userName }} {{ user.idCard }}
					<button v-on:click="deleteUser(user)">删除</button>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { openDevice, readDevice, closeDevice } from '@/api/idCard'
import '@/db/sequelize'
import User from '@/model/user'
import { initDB } from '@/db/init'

export default {
	name: "Home",
	components: {
	},
	mounted: async function () {
		console.log('mounted')
		await this.userList()
	},
	methods: {
		async test () {
			console.log("测试")
		},
		async open () {
			const { data } = await openDevice()
			const { errorMsg: msg } = data
			this.status = msg
		},
		async read () {
			const result = await readDevice()
			const { data } = result
			const { partyName, certNumber, errorMsg } = data
			this.name = partyName
			this.idCard = certNumber
			if (errorMsg) {
				this.status = errorMsg
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
			if (!this.name || !this.idCard) {
				alert('信息不能为空')
				return
			}
			await User.create({
				userName: this.name,
				idCard: this.idCard
			})
			await this.userList()
		},
		async deleteUser (user) {
			console.log(user)
			await user.destroy()
			await this.userList()
		},
		async updateUser (user) {
			console.log("更新用户")
			await user.update({ userName: 'xuyaxiong' })
		},
		async userList () {
			const users = await User.findAll()
			this.users = users
		},
	},
	data () {
		return {
			name: '',
			idCard: '',
			status: '',
			users: []
		}
	}
};
</script>
