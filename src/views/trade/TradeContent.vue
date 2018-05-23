<template>
    <div>
        <el-table >
            <el-table-column label="#" align="center">
                <template slot-scope="scope">
                    {{(scope.$index + 1) + (currentPage - 1) * currentNum}}
                </template>
            </el-table-column>
            <el-table-column label="Name" align="center">
                <template slot-scope="scope">
                    {{(scope.$index + 1) + (currentPage - 1) * currentNum}}
                </template>
            </el-table-column>
            <el-table-column label="Num" align="center">
                <template slot-scope="scope">
                    {{(scope.$index + 1) + (currentPage - 1) * currentNum}}
                </template>
            </el-table-column>
            <el-table-column label="Price" align="center">
                <template slot-scope="scope">
                    {{(scope.$index + 1) + (currentPage - 1) * currentNum}}
                </template>
            </el-table-column>
            <el-table-column label="Total" align="center">
                <template slot-scope="scope">
                    {{(scope.$index + 1) + (currentPage - 1) * currentNum}}
                </template>
            </el-table-column>
            <el-table-column label="Buy/Sell" align="center">
                <template slot-scope="scope">
                    {{(scope.$index + 1) + (currentPage - 1) * currentNum}}
                </template>
            </el-table-column>
            <el-table-column label="Time" align="center">
                <template slot-scope="scope">
                    {{(scope.$index + 1) + (currentPage - 1) * currentNum}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "TradeContent"
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .el-table::before
        width 0
</style>
