<template>
  <div :class="'piece n-'+ n">
    <template v-if="n">
    {{n}}
    </template>
  </div>
</template>

<script>
export default {
  name: 'PieceNumber',
  props: {
    n: {
      type: Number,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.piece {
  width: 50px;
  margin: 6px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 5px;
  color: #fff;
  background-color: #ccc0b3;
}
.n-2 {
  background-color: #eee4da;
  color: #73695f;
}
.n-4 {
  background-color: #eddfc7;
  color: #7b746c;
}
.n-8 {
  background-color: #f2b179;
}
.n-16 {
  background-color: #f69865;
}
.n-32 {
  background-color: #f67c5f;
}
.n-64 {
  background-color: #f5613c;
}
.n-128 {
  background-color: #edcf72;
}
.n-256 {
  background-color: #edcc61;
}
.n-512 {
  background-color: #edc850;
}
.n-1024 {
  background-color: #e2b913;
}
.n-2048 {
  background-color: #edc22e;
}
.n-4096 {
  background-color: #413e35;
}
</style>
