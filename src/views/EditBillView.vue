<template>
  <div class="container mt-5 mb-5" v-if="bill">
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="mb-4">Éditer une facture</h2>
      <div>
        <button class="btn btn-danger me-2" @click="deleteBill">
          <i class="fa fa-trash"></i> Supprimer
        </button>
        <button class="btn btn-secondary" @click="goBack">
          <i class="fa fa-arrow-left"></i> Retour
        </button>
      </div>
    </div>
    <form @submit.prevent="saveBill">
      <div class="row mb-2">
        <div class="col-md-6 d-flex align-items-center mb-3">
          <label for="billNumber" class="form-label me-3 label-width">Facture N° :</label>
          <input type="text" class="form-control" id="billNumber" v-model="bill.billnum" readonly />
        </div>
        <div class="col-md-6 d-flex align-items-center mb-3">
          <label for="billDate" class="form-label me-3 label-width">Émise le :</label>
          <input type="date" class="form-control" id="billDate" v-model="bill.date" />
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-md-6 d-flex align-items-center mb-3">
          <label for="client" class="form-label me-3 label-width">Client :</label>
          <select class="form-select" id="client" v-model="bill.client.idclient">
            <option v-for="client in clients" :key="client.idclient" :value="client.idclient">
              {{ client.firstName }} {{ client.lastName }}
            </option>
          </select>
        </div>
        <div class="col-md-6 d-flex align-items-center mb-3">
          <label for="description" class="form-label me-3 label-width">Description :</label>
          <input type="text" class="form-control" id="description" v-model="bill.description" />
        </div>
      </div>
      <table class="table table-bordered mb-4">
        <thead>
          <tr>
            <th>Actions</th>
            <th>Prestation</th>
            <th>Quantité</th>
            <th>Montant unitaire</th>
            <th>Montant total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(prestation, index) in bill.prestations" :key="prestation.id">
            <td>
              <button type="button" class="btn btn-success me-2" @click="addPrestation">
                <i class="fa fa-plus"></i>
              </button>
              <button type="button" class="btn btn-danger" @click="removePrestation(index)">
                <i class="fa fa-trash"></i>
              </button>
            </td>
            <td>
              <input type="text" class="form-control" v-model="prestation.description" />
            </td>
            <td>
              <input type="number" class="form-control" v-model="prestation.qty" />
            </td>
            <td>
              <input type="number" class="form-control" v-model="prestation.price" />
            </td>
            <td>{{ (prestation.qty * prestation.price).toFixed(2) }} €</td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-end">
        <div class="col-md-8"></div>
        <div class="col-md-4">
          <div class="d-flex mb-3 align-items-center">
            <label class="form-label me-3 label-width">Remises</label>
            <input type="number" class="form-control" v-model="bill.discount" />
          </div>
          <div class="d-flex mb-3 align-items-center">
            <label class="form-label me-3 label-width">Déjà payé</label>
            <input type="number" class="form-control" v-model="bill.paid" />
          </div>
          <div class="d-flex mb-3 align-items-center">
            <label class="form-label me-3 label-width">Total HT</label>
            <input type="number" class="form-control" :value="calculateTotalHT()" readonly />
          </div>
          <div class="d-flex mb-3 align-items-center">
            <label class="form-label me-3 label-width">TVA (20%)</label>
            <input type="number" class="form-control" :value="calculateTVA()" readonly />
          </div>
          <div class="d-flex mb-3 align-items-center">
            <label class="form-label me-3 label-width">Montant TTC</label>
            <input
              type="number"
              class="form-control montant-ttc"
              :value="calculateTotalTTC()"
              readonly
            />
          </div>
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary">Enregistrer</button>
          </div>
        </div>
      </div>
    </form>
  </div>
  <div v-else class="text-center mt-5">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
import { useBillStore } from '../stores/useBillStore'
import { useClientStore } from '../stores/useClientStore'
import { computed, ref, onMounted } from 'vue'

export default {
  props: ['id'],
  setup(props) {
    const billStore = useBillStore()
    const clientStore = useClientStore()

    const bill = ref(null)
    const clients = computed(() => clientStore.clients)

    onMounted(async () => {
      const fetchedBill = await billStore.getItem(props.id)
      bill.value = fetchedBill
      console.log('Fetched bill:', bill.value)
    })

    const addPrestation = () => {
      bill.value.prestations.push({
        id: Date.now(),
        description: '',
        qty: 1,
        price: 0
      })
    }

    const removePrestation = (index) => {
      bill.value.prestations.splice(index, 1)
    }

    const calculateTotalHT = () => {
      const total = bill.value.prestations.reduce((total, prestation) => {
        return total + prestation.qty * prestation.price
      }, 0)
      return (total - bill.value.discount).toFixed(2)
    }

    const calculateTVA = () => {
      return (calculateTotalHT() * 0.2).toFixed(2)
    }

    const calculateTotalTTC = () => {
      return (parseFloat(calculateTotalHT()) + parseFloat(calculateTVA())).toFixed(2)
    }

    const saveBill = async () => {
      if (bill.value && bill.value.id) {
        await billStore.patchItem(bill.value)
        goBack()
      } else {
        console.error('Bill or Bill ID is undefined')
      }
    }

    const deleteBill = async () => {
      if (bill.value && bill.value.id) {
        await billStore.deleteItem(bill.value.id)
        console.log('Bill deleted')
        goBack()
      } else {
        console.error('Bill or Bill ID is undefined')
      }
    }

    const goBack = () => {
      window.history.back()
    }

    return {
      bill,
      clients,
      addPrestation,
      removePrestation,
      calculateTotalHT,
      calculateTVA,
      calculateTotalTTC,
      saveBill,
      deleteBill,
      goBack
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
.d-flex .me-3 {
  margin-right: 1rem !important;
}
.label-width {
  width: 150px;
}
.montant-ttc {
  background-color: #f0f0f0;
  font-weight: bold;
}
</style>
