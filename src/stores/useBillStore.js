import { defineStore } from 'pinia'
import { useClientStore } from './useClientStore'

export const useBillStore = defineStore('bill', {
  state: () => ({
    bills: [],
    clients: [],
    loading: false
  }),
  getters: {
    getClientName: (state) => (idclient) => {
      const client = state.clients.find((client) => client.idclient === idclient)
      return client ? `${client.firstName} ${client.lastName}` : ''
    },
    calculateTotalHT: () => (bill) => {
      return bill.prestations
        .reduce((total, prestation) => {
          return total + prestation.qty * prestation.price
        }, 0)
        .toFixed(2)
    },
    calculateTotalTTC: () => (bill) => {
      const totalHT = parseFloat(
        bill.prestations
          .reduce((total, prestation) => {
            return total + prestation.qty * prestation.price
          }, 0)
          .toFixed(2)
      )
      const TVA = (totalHT * 0.2).toFixed(2)
      return (totalHT + parseFloat(TVA)).toFixed(2)
    }
  },
  actions: {
    async getClients() {
      this.loading = true
      const clientStore = useClientStore()
      try {
        await clientStore.getItems()
        this.clients = clientStore.clients
        console.log('Fetched clients for bills:', this.clients)
      } catch (error) {
        console.error('Failed to fetch clients:', error)
      } finally {
        this.loading = false
      }
    },
    async getItems() {
      this.loading = true
      try {
        const response = await this.$http.get('/bills')
        this.bills = response.data
        console.log('Fetched bills:', this.bills)
      } catch (error) {
        console.error('Failed to fetch bills:', error)
      } finally {
        this.loading = false
      }
    },
    async getItem(id) {
      this.loading = true
      try {
        const response = await this.$http.get(`/bills/${id}`)
        return response.data
      } catch (error) {
        console.error('Failed to fetch bill:', error)
      } finally {
        this.loading = false
      }
    },
    async postItem(newBill) {
      this.loading = true
      try {
        const response = await this.$http.post('/bills', newBill)
        this.bills.push(response.data)
        console.log('Added bill:', response.data)
      } catch (error) {
        console.error('Failed to add bill:', error)
      } finally {
        this.loading = false
      }
    },
    async patchItem(form) {
      this.loading = true
      try {
        const response = await this.$http.patch(`/bills/` + form.id, form)
        console.log('Updated bill:', response.data)
        this.loading = false
      } catch (error) {
        console.error('Failed to update bill:', error)
      } finally {
        this.loading = false
      }
    },
    async deleteItem(id) {
      this.loading = true
      try {
        const response = await this.$http.delete(`/bills/${id}`)
        await this.getItems()
        console.log('Deleted bill:', response.data)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
})
