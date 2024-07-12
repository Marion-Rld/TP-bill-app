<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Dashboard</h2>
      <div>
        <button class="btn btn-primary me-2" @click="addClient">
          <i class="fa fa-user-plus"></i> Ajouter un client
        </button>
        <button class="btn btn-primary" @click="addBill">
          <i class="fa fa-file"></i> Ajouter une facture
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">{{ totalInvoices }} Factures en 2024</h3>
            <canvas id="myChart" width="400" height="400"></canvas>
            <ul class="list-unstyled mt-4">
              <li>
                <span class="dot" style="background-color: #ff6384"></span> Total Encaissée TTC -
                {{ totalEncaisséeTTC }}%
              </li>
              <li>
                <span class="dot" style="background-color: #36a2eb"></span> Total Facture TTC -
                {{ totalFactureTTC }}%
              </li>
              <li>
                <span class="dot" style="background-color: #ffce56"></span> Dû à plus d'un mois TTC
                - {{ duPlusDunMoisTTC }}%
              </li>
            </ul>
            <div class="d-flex justify-content-end">
              <p class="mt-3 fw-bold">{{ totalAmount }} €</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="row">
          <div class="col-md-12 mb-4">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">Factures en cours</h4>
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th>Client</th>
                      <th>Montant HT</th>
                      <th>Montant TTC</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="bill in bills" :key="bill.id">
                      <td>{{ bill.billnum }}</td>
                      <td>{{ getClientName(bill.client.idclient) }}</td>
                      <td>{{ calculateTotalHT(bill) }} € HT</td>
                      <td>{{ calculateTotalTTC(bill) }} € TTC</td>
                      <td>
                        <button class="btn btn-outline-primary" @click="editBill(bill.id)">
                          Éditer
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">Clients</h4>
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Nom du contact</th>
                      <th>Entreprise</th>
                      <th>Date d'ajout</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="client in clients" :key="client.idclient">
                      <td>{{ client.firstName }} {{ client.lastName }}</td>
                      <td>{{ client.companyName }}</td>
                      <td>{{ client.additionDate }}</td>
                      <td>
                        <button
                          class="btn btn-outline-primary"
                          @click="editClient(client.idclient)"
                        >
                          Éditer
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useBillStore } from '../stores/useBillStore'
import { useClientStore } from '../stores/useClientStore'
import { Chart, registerables } from 'chart.js'
import { defineComponent, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

Chart.register(...registerables)

export default defineComponent({
  setup() {
    const router = useRouter()
    const billStore = useBillStore()
    const clientStore = useClientStore()

    const totalInvoices = computed(() => billStore.bills.length)
    const totalAmount = computed(() => {
      return billStore.bills
        .reduce((total, bill) => {
          return total + parseFloat(billStore.calculateTotalTTC(bill))
        }, 0)
        .toFixed(2)
    })

    const bills = computed(() => billStore.bills)
    const clients = computed(() => clientStore.clients)
    const getClientName = (idclient) => billStore.getClientName(idclient)
    const calculateTotalHT = (bill) => billStore.calculateTotalHT(bill)
    const calculateTotalTTC = (bill) => billStore.calculateTotalTTC(bill)

    const totalEncaisséeTTC = computed(() => {
      const totalEncaissée = billStore.bills.filter((bill) => bill.paid >= bill.totalTTC).length
      return ((totalEncaissée / billStore.bills.length) * 100).toFixed(1)
    })

    const totalFactureTTC = computed(() => {
      return ((billStore.bills.length / billStore.bills.length) * 100).toFixed(1)
    })

    const duPlusDunMoisTTC = computed(() => {
      const now = new Date()
      const overdue = billStore.bills.filter((bill) => {
        const billDate = new Date(bill.date)
        const diffTime = now - billDate
        const diffDays = diffTime / (1000 * 60 * 60 * 24)
        return diffDays > 30 && bill.paid < bill.totalTTC
      }).length
      return ((overdue / billStore.bills.length) * 100).toFixed(1)
    })

    const addClient = () => {
      router.push({ name: 'addClient' })
    }

    const addBill = () => {
      router.push({ name: 'addBill' })
    }

    const editBill = (id) => {
      router.push({ name: 'editBill', params: { id } })
    }

    const editClient = (id) => {
      router.push({ name: 'editClient', params: { id } })
    }

    const renderChart = () => {
      const ctx = document.getElementById('myChart').getContext('2d')
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Total Encaissée TTC', 'Total Facture TTC', "Dû à plus d'un mois TTC"],
          datasets: [
            {
              data: [totalEncaisséeTTC.value, totalFactureTTC.value, duPlusDunMoisTTC.value],
              backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    }

    onMounted(async () => {
      await clientStore.getItems()
      await billStore.getItems()
      renderChart()
    })

    return {
      totalInvoices,
      totalAmount,
      bills,
      clients,
      getClientName,
      calculateTotalHT,
      calculateTotalTTC,
      totalEncaisséeTTC,
      totalFactureTTC,
      duPlusDunMoisTTC,
      addClient,
      addBill,
      editBill,
      editClient
    }
  }
})
</script>

<style>
.container {
  max-width: 1200px;
}
.card {
  margin-bottom: 20px;
}
.card-body {
  padding: 20px;
}
.table {
  margin-top: 20px;
}
#myChart {
  max-height: 400px;
}
.dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
</style>
