<template>
  <div class="container mt-5 mb-5">
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="mb-4">Ajouter une facture</h2>
      <button class="btn btn-secondary" @click="goBack">
        <i class="fa fa-arrow-left"></i> Retour
      </button>
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
              <button type="button" class="btn btn-danger me-2" @click="removePrestation(index)">
                <i class="fa fa-trash"></i>
              </button>
            </td>
            <td>
              <input type="text" class="form-control" v-model="prestation.description" />
            </td>
            <td>
              <input type="number" class="form-control" v-model.number="prestation.qty" />
            </td>
            <td>
              <input type="number" class="form-control" v-model.number="prestation.price" />
            </td>
            <td>{{ (prestation.qty * prestation.price).toFixed(2) }} €</td>
          </tr>
          <tr>
            <td>
              <button type="button" class="btn btn-success me-2" @click="addPrestation">
                <i class="fa fa-plus"></i>
              </button>
            </td>
            <td>
              <input
                type="text"
                class="form-control"
                v-model="newPrestation.description"
                placeholder="Nouvelle prestation"
              />
            </td>
            <td>
              <input
                type="number"
                class="form-control"
                v-model.number="newPrestation.qty"
                placeholder="Quantité"
              />
            </td>
            <td>
              <input
                type="number"
                class="form-control"
                v-model.number="newPrestation.price"
                placeholder="Montant unitaire"
              />
            </td>
            <td>{{ (newPrestation.qty * newPrestation.price).toFixed(2) }} €</td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-end">
        <div class="col-md-8"></div>
        <div class="col-md-4">
          <div class="d-flex mb-3 align-items-center">
            <label class="form-label me-3 label-width">Remises</label>
            <input type="number" class="form-control" v-model.number="bill.discount" />
          </div>
          <div class="d-flex mb-3 align-items-center">
            <label class="form-label me-3 label-width">Déjà payé</label>
            <input type="number" class="form-control" v-model.number="bill.paid" />
          </div>
          <div class="d-flex mb-3 align-items-center">
            <label class="form-label me-3 label-width">Total HT</label>
            <input type="number" class="form-control" :value="totalHT" readonly />
          </div>
          <div class="d-flex mb-3 align-items-center">
            <label class="form-label me-3 label-width">TVA (20%)</label>
            <input type="number" class="form-control" :value="TVA" readonly />
          </div>
          <div class="d-flex mb-3 align-items-center">
            <label class="form-label me-3 label-width">Montant TTC</label>
            <input type="number" class="form-control montant-ttc" :value="totalTTC" readonly />
          </div>
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary">Enregistrer</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useBillStore } from '../stores/useBillStore'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

export default {
  setup() {
    const billStore = useBillStore()
    const router = useRouter()

    const bill = ref({
      id: Date.now(),
      billnum: Date.now(),
      date: '',
      client: { idclient: '' },
      description: '',
      prestations: [],
      discount: 0,
      paid: 0
    })

    const newPrestation = ref({
      description: '',
      qty: 1,
      price: 0
    })

    const addPrestation = () => {
      if (
        newPrestation.value.description &&
        newPrestation.value.qty > 0 &&
        newPrestation.value.price >= 0
      ) {
        bill.value.prestations.push({
          id: Date.now(),
          description: newPrestation.value.description,
          qty: newPrestation.value.qty,
          price: newPrestation.value.price
        })
        newPrestation.value = { description: '', qty: 1, price: 0 }
      }
    }

    const removePrestation = (index) => {
      bill.value.prestations.splice(index, 1)
    }

    const saveBill = async () => {
      await billStore.postItem(bill.value)
      goBack()
    }

    const goBack = () => {
      router.back()
    }

    const totalHT = computed(() => {
      return bill.value.prestations
        .reduce((total, prestation) => {
          return total + prestation.qty * prestation.price
        }, 0)
        .toFixed(2)
    })

    const TVA = computed(() => (totalHT.value * 0.2).toFixed(2))

    const totalTTC = computed(() => (parseFloat(totalHT.value) + parseFloat(TVA.value)).toFixed(2))

    return {
      bill,
      newPrestation,
      addPrestation,
      removePrestation,
      saveBill,
      goBack,
      clients: billStore.clients,
      totalHT,
      TVA,
      totalTTC
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
