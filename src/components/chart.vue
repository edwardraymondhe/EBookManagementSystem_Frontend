<script>
    import { Bar } from 'vue-chartjs'

    export default {
        name: "Chart",
        extends: Bar,
        props: {
            chartdata: {
                type: Object,
                default: null
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        },
        watch: {
            chartdata(newValue, oldValue) {
                console.log(oldValue);
                this.renderChart(newValue, this.options);
            }
        },
        mounted () {
            this.renderChart(this.chartdata, this.options);
        }
    }
</script>
