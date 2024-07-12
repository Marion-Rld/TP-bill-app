<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between">
      <h2 class="mb-4">Liste des factures</h2>
      <button class="btn btn-primary mb-3" @click="addBill">
        <i class="fa-solid fa-circle-plus"></i> Ajouter une facture
      </button>
    </div>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <table v-else class="table table-striped">
      <tbody>
        <tr v-for="bill in bills" :key="bill.id">
          <td>{{ formatDate(bill.date) }}</td>
          <td>{{ bill.description }} / Facture N° {{ bill.billnum }}</td>
          <td>{{ getClientName(bill.client.idclient) }}</td>
          <td>{{ calculateTotalHT(bill) }} € HT</td>
          <td class="fw-bold">{{ calculateTotalTTC(bill) }} € TTC</td>
          <td>
            <button class="btn btn-danger me-2" @click="deleteBill(bill.id)">
              <i class="fa fa-trash"></i> Supprimer
            </button>
            <button class="btn btn-secondary" @click="editBill(bill.id)">
              <i class="fa fa-edit"></i> Éditer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useBillStore } from '../stores/useBillStore'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

export default {
  setup() {
    const billStore = useBillStore()
    const router = useRouter()

    const formatDate = (date) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
      return new Date(date).toLocaleDateString('fr-FR', options)
    }

    const addBill = () => {
      router.push({ name: 'addBill' })
    }

    const editBill = (id) => {
      router.push({ name: 'editBill', params: { id } })
    }

    const deleteBill = async (id) => {
      await billStore.deleteItem(id)
    }

    const bills = computed(() => billStore.bills)
    const loading = computed(() => billStore.loading)
    const getClientName = billStore.getClientName
    const calculateTotalHT = billStore.calculateTotalHT
    const calculateTotalTTC = billStore.calculateTotalTTC

    onMounted(async () => {
      await billStore.getItems()
      await billStore.getClients()
    })

    return {
      bills,
      loading,
      getClientName,
      calculateTotalHT,
      calculateTotalTTC,
      formatDate,
      addBill,
      editBill,
      deleteBill
    }
  }
}
</script>

<style>
.container {
  max-width: 1200px;
}
.table {
  margin-top: 20px;
}
</style>
