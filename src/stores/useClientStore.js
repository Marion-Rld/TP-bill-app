import { defineStore } from 'pinia'

export const useClientStore = defineStore('clientStore', {
  state: () => ({
    clients: [],
    companies: [],
    loading: false
  }),
  actions: {
    async getItems() {
      this.loading = true
      try {
        const response = await this.$http.get('/clients')
        this.clients = response.data
        console.log('Fetched clients:', this.clients)
      } catch (error) {
        console.error('Failed to fetch clients:', error)
      } finally {
        this.loading = false
      }
    },

    async getItem(idclient) {
      this.loading = true
      try {
        const response = await this.$http.get(`/clients/${idclient}`)
        return response.data
      } catch (error) {
        console.error('Failed to fetch client:', error)
      } finally {
        this.loading = false
      }
    },

    async postItem(newClient) {
      this.loading = true
      try {
        const response = await this.$http.post('/clients', newClient)
        this.clients.push(response.data)
        console.log('Client added:', response.data)
      } catch (error) {
        console.error('Failed to add client:', error)
      } finally {
        this.loading = false
      }
    },

    async patchItem(form) {
      this.loading = true
      try {
        const response = await this.$http.patch(`/clients/` + form.idclient, form)
        console.log('Client updated:', response.data)
        this.loading = false
      } catch (error) {
        console.error('Failed to update client:', error)
      } finally {
        this.loading = false
      }
    },
    async deleteItem(idclient) {
      this.loading = true
      try {
        const response = await this.$http.delete(`/clients/${idclient}`)
        await this.getItems()
        console.log('Client deleted:', response.data)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async getCompanies() {
      this.loading = true
      try {
        const response = await this.$http.get('/clients')
        const companyNames = response.data.map((client) => client.companyName)
        const uniqueCompanies = [...new Set(companyNames)].map((name, index) => ({
          id: index + 1,
          name
        }))
        this.companies = uniqueCompanies
        console.log('Fetched companies:', this.companies)
      } catch (error) {
        console.error('Failed to fetch companies:', error)
      } finally {
        this.loading = false
      }
    },
    setCompanies(companies) {
      this.companies = companies
    }
  }
})
