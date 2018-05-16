<template>
    <div>
        <div id="head">
            <router-link :to="{name: 'currencyList', query: {page: this.$route.query.page}}">
                <img src="../../../static/img/logo.svg" class="logo">
            </router-link>
        </div>
        <div id="content">
            <el-row :gutter="20" class="top">
                <el-col :span="8">
                    <div class="details card">
                        <div class="head">
                            <div class="info cf">
                                <div class="left name">
                                    {{currencyPrice['name']}}
                                </div>
                                <div class="right ico-info" v-if="currencyAdditionInfo_myToken">
                                    <p>{{currencyAdditionInfo_myToken.ico_date_display}}</p>
                                    <p>{{currencyAdditionInfo_myToken.exchange_rate_display}}</p>
                                    <p>{{currencyAdditionInfo_myToken.raised_amount_display}}</p>
                                </div>
                            </div>
                            <ul class="tag">
                                <li v-for="(tag, index) in tagList">{{`#${tag['tag_name']}`}}</li>
                            </ul>
                        </div>
                        <div class="content">
                            <div class="price">
                                <ul>
                                    <li>
                                        <span class="title">{{$t('page.currencyDetail.th1')}}</span>
                                        <span>{{customerParseFloat(currencyPrice['market_cap_usd'], '$')}}</span>
                                    </li>
                                    <li>
                                        <span class="title">{{$t('page.currencyDetail.th2')}}</span>
                                        <span>{{customerParseFloat(currencyPrice['price_usd'], '$')}}</span>
                                    </li>
                                    <li>
                                        <span class="title">{{$t('page.currencyDetail.th3')}}</span>
                                        <span>{{customerParseFloat(currencyPrice['24h_volume_usd'], '$')}}</span>
                                    </li>
                                    <li>
                                        <span class="title">{{$t('page.currencyDetail.th4')}}</span>
                                        <span>{{customerParseFloat(currencyPrice['available_supply'])}}</span>
                                    </li>
                                    <li>
                                        <span class="title">{{$t('page.currencyDetail.th5')}}</span>
                                        <span :style="{color: currencyPrice['percent_change_24h'] < 0 ? '#d14836' : '#019933'}">
                                        {{currencyPrice['percent_change_24h'] + '%'}}
                                    </span>
                                    </li>
                                </ul>
                            </div>
                            <el-row class="links">
                                <el-col :span="12">
                                    <ul>
                                        <li>
                                            <a href="" target="_blank">
                                                <img class="logo" src="../../../static/img/website.png"/>
                                                <span>website</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://icorating.com/" target="_blank">
                                                <img class="logo" src="../../../static/img/icorating.png"/>
                                                <span>icorating</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://icorating.com/" target="_blank">
                                                <img class="logo" src="../../../static/img/icorating.png"/>
                                                <span>icorating</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="" target="_blank">
                                                <img class="logo" src="../../../static/img/normal.png"/>
                                                <span>fira</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="http://www.github.com" target="_blank">
                                                <img class="logo" src="../../../static/img/github.png"/>
                                                <span>Github</span>
                                            </a>
                                        </li>
                                    </ul>
                                </el-col>
                                <el-col :span="12">
                                    <ul>
                                        <li>
                                            <a href="https://icobench.com/" target="_blank">
                                                <img class="logo" src="../../../static/img/icobench.png"/>
                                                <span>icobench</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://cryptorated.com/" target="_blank">
                                                <img class="logo" src="../../../static/img/cryptorated.png"/>
                                                <span>cryptorated</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="http://inwecrypto.com/en/home" target="_blank">
                                                <img class="logo" src="../../../static/img/inwecrypto.png"/>
                                                <span>inwecrypto</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="http://www.reddit.com" target="_blank">
                                                <img class="logo" src="../../../static/img/reddit.png"/>
                                                <span>reddit</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="http://www.bitcointalk.com" target="_blank">
                                                <img class="logo" src="../../../static/img/normal.png"/>
                                                <span>bitcointalk</span>
                                            </a>
                                        </li>
                                    </ul>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="charts card">
                        <div class="head">
                            <button @click="topCurrencyChartType = 1" :class="{active: topCurrencyChartType === 1}">Price</button>
                            <button @click="topCurrencyChartType = 2"  :class="{active: topCurrencyChartType === 2}">History Rank</button>
                            <span @click="toPriceContrast" class="price_contrast">价格对比</span>
                        </div>
                        <div class="content">
                            <div class="currency-chart" ref="topCurrencyChart"></div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <!--备注-->
            <div class="card note">
                <div class="collapse-head" @click="noteShow = !noteShow">
                    <div class="name">
                        Note
                    </div>
                    <div class="right-icon">
                        <i class="el-icon-caret-top" v-if="noteShow"></i>
                        <i class="el-icon-caret-bottom" v-else></i>
                    </div>
                </div>
                <div class="collapse-body" v-show="noteShow">
                    <div class="ctl">
                        <button @click="noteDiaVisible = true">New</button>
                    </div>
                    <ul>
                        <li v-for="(item, index) in noteList"
                            :class="{odd: index % 2 === 0}"
                            :key="index">
                            <div class="cell content">
                                <p>{{item['remark']}}</p>
                            </div>
                            <div class="cell opt right">
                                <span @click="noteDelConfirm(item['id'])">Delete</span>
                            </div>
                            <div class="cell date right">
                                {{getSmpFormatDateByLong(item['time'])}}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!--添加备注的弹出框-->
            <el-dialog title="备注内容" :visible.sync="noteDiaVisible">
                <el-form ref="form" :model="noteForm" label-width="80px">
                    <el-input type="textarea" v-model="noteForm.desc"></el-input>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="noteDiaVisible = false">取 消</el-button>
                    <el-button type="primary" @click="noteDiaConfirm">确 定</el-button>
                </div>
            </el-dialog>

            <!--btt card-->
            <div class="card btt"
                 v-if="bttCardShow"
                 v-loading="bttCardLoading"
                 :element-loading-text="$t('loading')"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)">
                <div class="collapse-head" @click="toggleBttSpan">
                    <div class="name">
                        Bitcointalk
                    </div>
                    <div class="right-icon">
                        <i class="el-icon-caret-top" v-if="bttShow"></i>
                        <i class="el-icon-caret-bottom" v-else></i>
                    </div>
                </div>
                <div class="collapse-body" v-show="bttShow">
                    <el-tabs tab-position="top" class="tab" @tab-click="bttTabClick">
                        <el-tab-pane :label="$t('page.currencyDetail.l1')">
                            <div class="link-content">
                                <el-table
                                    stripe
                                    :data="bttLink"
                                    style="width: 100%">
                                    <el-table-column
                                        :label="$t('page.currencyDetail.th6')">
                                        <template slot-scope="scope">
                                            <a :href="scope.row['link_url']" target="_blank">{{scope.row['title']}}</a>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        sortable
                                        align="center"
                                        prop="views"
                                        :label="$t('page.currencyDetail.th7')"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        sortable
                                        align="center"
                                        prop="replies"
                                        :label="$t('page.currencyDetail.th8')"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        :label="$t('page.currencyDetail.th9')"
                                        align="center"
                                        width="180">
                                        <template slot-scope="scope">
                                            <a :href="scope.row['profile_url']"
                                               target="_blank">{{scope.row['started_by']}}</a>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('page.currencyDetail.l2')" class="user-relation-pane">
                            <el-row :gutter="20" v-if="bttUserRelationLinks.length > 0">
                                <el-col :span="8">
                                    <ul>
                                        <li v-for="(item, index) in bttUserRelationLinks"
                                            :class="{active : index === userRelationLinkActive}"
                                            @click="getBttUserRelation(item.id, index)">
                                            {{item['title']}}
                                        </li>
                                    </ul>
                                </el-col>
                                <el-col :span="16" style="text-align: center; border-left: 1px solid #E4E7ED;">
                                    <div ref="userRelationChart"
                                         style="width: 800px; height: 600px; display: inline-block; "></div>
                                </el-col>
                            </el-row>
                            <div v-else>
                                {{$t('noData')}}
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('page.currencyDetail.l3')"  class="user-relation-pane">
                            <el-row :gutter="20" v-if="bttTimeDistributeLinks.length > 0">
                                <el-col :span="8">
                                    <ul>
                                        <li v-for="(item, index) in bttTimeDistributeLinks"
                                            :class="{active : index === timeDistributeLinkActive}"
                                            @click="getBttTimeDistributeData(item.id, index)">
                                            {{item['title']}}
                                        </li>
                                    </ul>
                                </el-col>
                                <el-col :span="16" style="text-align: center; border-left: 1px solid #E4E7ED;">
                                    <div ref="historyPriceChart"
                                         style="width: 1000px; height: 600px; display: inline-block; "></div>
                                </el-col>
                            </el-row>
                            <div v-else>
                                {{$t('noData')}}
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <!--reddit card-->
            <div class="card reddit"
                 v-if="redditCardShow"
                 v-loading="redditCardLoading"
                 :element-loading-text="$t('loading')"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)">
                <div class="collapse-head" @click="toggleRedditSpan">
                    <div class="name">
                        <img src="../../../static/img/reddit_2.svg">Reddit
                        <a :href="'http://www.reddit.com'+subReddit[0]['url']"
                           target="_blank">({{'http://www.reddit.com' + subReddit[0]['url']}})</a>
                    </div>
                    <div class="top-content">
                        <div class="top-item">
                            <span>{{subReddit[0]['subscribers']}}</span>
                            <span class="label">{{$t('page.currencyDetail.t3')}}</span>
                        </div>
                        <div class="top-item">
                            <span>{{subReddit[0]['accounts_active']}}</span>
                            <span class="label">{{$t('page.currencyDetail.t4')}}</span>
                        </div>
                        <div class="top-item">
                            <span>{{getSmpFormatDateByLong(subReddit[0]['created'] * 1000, false)}}</span>
                            <span class="label">{{$t('page.currencyDetail.t5')}}</span>
                        </div>
                    </div>
                    <div class="right-icon">
                        <i class="el-icon-caret-top" v-if="redditShow"></i>
                        <i class="el-icon-caret-bottom" v-else></i>
                    </div>
                </div>
                <div class="collapse-body" v-show="redditShow">
                    <el-tabs tab-position="top" class="tab" @tab-click="redditTabClick">
                        <el-tab-pane :label="$t('page.currencyDetail.l1')">
                            <div class="link-content">
                                <div class="Pagination">
                                    <div class="left">
                                        <el-dropdown @command="handleRedditPostDaysCommand" split-button type="primary">
                                            {{$t('page.currencyDetail.'+REDDITDAYSDROPDOWN[redditPostCurrentDayIndex]['i18n'])}}
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item v-for="(item, index) in REDDITDAYSDROPDOWN" :command="item.command" :key="index">
                                                    {{$t('page.currencyDetail.'+item.i18n)}}
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                        <el-dropdown @command="handleRedditPostSortCommand" split-button type="primary">
                                            {{$t('page.currencyDetail.'+REDDITPOSTSORTFIELD[redditPostCurrentSortIndex]['i18n'])}}
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item v-for="(item, index) in REDDITPOSTSORTFIELD" :command="item.command" :key="index">
                                                    {{$t('page.currencyDetail.'+item.i18n)}}
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                        <el-dropdown @command="handleRedditPostExpressionCommand" split-button type="primary">
                                            {{$t('page.currencyDetail.'+REDDITPOSTEXPRESSION[redditPostCurrentExpressionIndex]['i18n'])}}
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item v-for="(item, index) in REDDITPOSTEXPRESSION" :command="item.command" :key="index">
                                                    {{$t('page.currencyDetail.'+item.i18n)}}
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </div>
                                    <el-pagination
                                        background
                                        layout="total, sizes, prev, pager, next, jumper"
                                        style="display: inline-block; vertical-align: middle"
                                        :total="redditPostCount"
                                        :current-page="redditPostCurrentPage"
                                        :page-size=redditPostCurrentNum
                                        :page-sizes="[10, 20, 50, 100]"
                                        @current-change="handleRedditPostPageChange"
                                        @size-change="handleRedditPostSizeChange">
                                    </el-pagination>
                                </div>
                                <el-table
                                    stripe
                                    v-if="redditPostCurrentExpressionIndex === 0"
                                    :data="redditLink"
                                    v-loading="redditPostTableLoading"
                                    :element-loading-text="$t('loading')"
                                    element-loading-spinner="el-icon-loading"
                                    element-loading-background="rgba(0, 0, 0, 0.8)"
                                    @sort-change="redditPostSortChange"
                                    style="width: 100%">
                                    <el-table-column
                                        :label="$t('page.currencyDetail.th6')">
                                        <template slot-scope="scope">
                                            <a :href="scope.row['url']" target="_blank">{{scope.row['title']}}</a>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        align="center"
                                        prop="score"
                                        :label="$t('page.currencyDetail.th10')"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        align="center"
                                        prop="num_comments"
                                        :label="$t('page.currencyDetail.th11')"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        prop="domain"
                                        :label="$t('page.currencyDetail.th12')"
                                        align="center"
                                        width="180">
                                    </el-table-column>
                                    <el-table-column
                                        :label="$t('page.currencyDetail.th9')"
                                        align="center"
                                        width="180">
                                        <template slot-scope="scope">
                                            <a :href="'https://www.reddit.com/user/'+scope.row['author']"
                                               target="_blank">
                                                {{scope.row['author']}}
                                            </a>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        :label="$t('page.currencyDetail.t5')"
                                        align="center"
                                        width="180">
                                        <template slot-scope="scope">
                                            {{getSmpFormatDateByLong(scope.row.created * 1000, false)}}
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div v-else id="redditPostDistributeChart" style="width: 80%; height: 600px; margin: 0 auto"></div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('page.currencyDetail.l2')">
                            <el-row :gutter="20" v-if="redditUser != null">
                                <el-col :span="12" class="link-content">
                                    <div class="line">
                                        <div class="title">
                                            Highest Score By <strong>Post</strong>
                                        </div>
                                    </div>
                                    <el-table
                                        stripe
                                        :data="redditUser['post_key_user']"
                                        style="width: 100%">
                                        <el-table-column
                                            :label="$t('page.currencyDetail.th9')">
                                            <template slot-scope="scope">
                                                <a :href="'http://www.reddit.com/user/'+ scope.row.author"
                                                   target="_blank">{{scope.row.author}}</a>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            align="center"
                                            prop="size"
                                            :label="$t('page.currencyDetail.th11')"
                                            width="180">
                                        </el-table-column>
                                        <el-table-column
                                            align="center"
                                            :label="$t('page.currencyDetail.th13')"
                                            width="180">
                                            <template slot-scope="scope">
                                                {{Math.floor(scope.row['mean'])}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            :label="$t('page.currencyDetail.th14')"
                                            prop="sum"
                                            align="center"
                                            width="180">
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                                <el-col :span="12" class="link-content">
                                    <div class="line">
                                        <div class="title">
                                            Highest Score By <strong>Comment</strong>
                                        </div>
                                    </div>
                                    <el-table
                                        stripe
                                        :data="redditUser['comment_key_user']"
                                        style="width: 100%">
                                        <el-table-column
                                            :label="$t('page.currencyDetail.th9')">
                                            <template slot-scope="scope">
                                                <a :href="'http://www.reddit.com/user/'+ scope.row.author"
                                                   target="_blank">{{scope.row.author}}</a>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            align="center"
                                            prop="size"
                                            :label="$t('page.currencyDetail.th11')"
                                            width="180">
                                        </el-table-column>
                                        <el-table-column
                                            align="center"
                                            :label="$t('page.currencyDetail.th13')"
                                            width="180">
                                            <template slot-scope="scope">
                                                {{Math.floor(scope.row['mean'])}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            :label="$t('page.currencyDetail.th14')"
                                            prop="sum"
                                            align="center"
                                            width="180">
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <!--github card-->
            <div class="card github"
                 v-if="githubCardShow"
                 v-loading="githubCardLoading"
                 :element-loading-text="$t('loading')"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)">
                <div class="collapse-head" @click="toggleGithubSpan">
                    <div class="name">
                        <img src="../../../static/img/github_2.svg">GitHub
                        <a :href="'http://www.github.com/'+githubProject[0]['full_name']"
                           target="_blank">({{'http://www.github.com/' + githubProject[0]['full_name']}})</a>
                    </div>
                    <div class="top-content">
                        <div class="top-item">
                            <span>{{githubProject[0]['subscribers_count']}}</span>
                            <span class="label">{{$t('page.currencyDetail.t3')}}</span>
                        </div>
                        <div class="top-item">
                            <span>{{githubProject[0]['watchers']}}</span>
                            <span class="label">{{$t('page.currencyDetail.t6')}}</span>
                        </div>
                        <div class="top-item">
                            <span>{{githubProject[0]['forks']}}</span>
                            <span class="label">{{$t('page.currencyDetail.t7')}}</span>
                        </div>
                        <div class="top-item">
                            <span>{{githubProject[0]['open_issues_count']}}</span>
                            <span class="label">{{$t('page.currencyDetail.t8')}}</span>
                        </div>
                        <div class="top-item">
                            <span>{{githubProject[0]['language']}}</span>
                            <span class="label">{{$t('page.currencyDetail.t9')}}</span>
                        </div>
                    </div>
                    <div class="right-icon">
                        <i class="el-icon-caret-top" v-if="githubShow"></i>
                        <i class="el-icon-caret-bottom" v-else></i>
                    </div>
                </div>
                <div class="collapse-body" v-show="githubShow">
                    <el-tabs tab-position="top" class="tab" @tab-click="githubTabClick">
                        <el-tab-pane :label="$t('page.currencyDetail.l4')">
                            <div v-for="(user,index) in githubUser" :key=index class="github-user">
                                <div class="info">
                                    <a :href="user.author.html_url" target="_blank">
                                        <img class="avatar" :src="user.author.avatar_url">
                                    </a>
                                </div>
                                <div class="info detail">
                                    <span class="name">{{user.author.name}} / {{user.author.login}}</span>
                                    <p>{{user.total}} commits</p>
                                    <p>{{user.author.followers}} followers  {{user.author.following}} following</p>
                                </div>
                                <div :ref="'user_commit_chart'+index" class="user_commit_chart">
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('page.currencyDetail.l5')">
                            <div ref="SCACharts" class="sca-charts">
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('page.currencyDetail.l6')" style="display: none;">
                            <div ref="SCFCharts" class="sca-charts">
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <!--xtoken card-->
            <div class="card xtoken"
                 v-if="xtokenCardShow"
                 v-loading="xtokenCardLoading"
                 :element-loading-text="$t('loading')"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)">
                <div class="collapse-head" @click="toggleXtokenSpan">
                    <div class="name">
                        <img src="../../../static/img/guan.svg">Xtoken
                        <router-link :to="'/whitepaper/upload?id=' + id" style="font-size: 14px;">
                            {{$t('page.currencyDetail.t10')}}
                        </router-link>
                    </div>
                    <div class="right-icon">
                        <i class="el-icon-caret-top" v-if="XtokenShow"></i>
                        <i class="el-icon-caret-bottom" v-else></i>
                    </div>
                </div>
                <div class="collapse-body" v-show="XtokenShow" style="min-height: 0">
                    <div class="link-content">
                        <el-table
                            :data="xtokenEventList"
                            style="width: 100%">
                            <el-table-column
                                min-width="500"
                                :label="$t('page.currencyDetail.th6')">
                                <template slot-scope="scope">
                                    <router-link :to="'/event/detail?id='+ scope.row.id" style="font-size: 14px;">
                                        {{scope.row.title}}
                                    </router-link>
                                </template>
                            </el-table-column>
                            <el-table-column
                                :label="$t('page.currencyDetail.th15')"
                                align="center"
                                max-width="180">
                                <template slot-scope="scope">
                                    {{eventType[scope.row.type]}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                :label="$t('page.currencyDetail.th16')"
                                max-width="180">
                                <template slot-scope="scope">
                                    {{calcVoteState(scope.row)}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                :label="$t('page.currencyDetail.th17')"
                                max-width="180">
                                <template slot-scope="scope">
                                    {{scope.row.trueFalseStat ? scope.row.trueFalseStat.all1Percent  : '--'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                :label="$t('page.currencyDetail.th18')"
                                align="center"
                                max-width="180">
                                <template slot-scope="scope">
                                    {{scope.row.trueFalseStat ? scope.row.trueFalseStat.all0Percent : '--'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                :label="$t('page.currencyDetail.th19')"
                                max-width="180">
                                <template slot-scope="scope">
                                    {{scope.row.roseFallStat ? scope.row.roseFallStat.all1Percent : '--'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                :label="$t('page.currencyDetail.th20')"
                                align="center"
                                max-width="180">
                                <template slot-scope="scope">
                                    {{scope.row.roseFallStat ? scope.row.roseFallStat.all0Percent : '--'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                :label="$t('page.currencyDetail.t5')"
                                align="center"
                                max-width="180">
                                <template slot-scope="scope">
                                    {{getDateDiff(scope.row.pusTime)}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import net_util from '../../assets/js/net_utils'
    import config from '../../assets/js/config'
    import utils from '../../assets/js/utils'
    import consts from '../../assets/js/consts'
    import echarts from 'echarts'

    const REDDITDAYSDROPDOWN = [
        {text: '最近一周', days: 7, command: 'week', i18n: 't14'},
        {text: '最近一个月', days: 30, command: 'month', i18n: 't15'},
        {text: '最近半年', days: 180, command: 'h-year', i18n: 't16'},
        {text: '全部', days: null, command: 'all', i18n: 't17'},
    ]

    const REDDITPOSTSORTFIELD = [
        {text: '回复最多', field: 'num_comments', command: 'num', i18n: 't18'},
        {text: '得分最高', field: 'ups', command: 'ups', i18n: 't19'},
        {text: '创建最早', field: 'created', command: 'time', i18n: 't20'},
    ]

    const REDDITPOSTEXPRESSION = [
        {text: '详细数据', command: 'data', i18n: 't21'},
        {text: '走势图', command: 'graph', i18n: 't22'}
    ]

    export default {
        data: function () {
            return {
                id: null,
                timeRadio: 1,
                currencyPrice: '',
                currencyAdditionInfo_myToken: '',
                historyPrice: null,
                priceList: [],
                bttLink: [],
                // 备注
                noteList: [],
                noteForm: {
                    desc: ''
                },
                noteDiaVisible: false,
                // 控制top-currency-chart的类型
                topCurrencyChartType: 1,
                // currency history rank
                currencyHistoryRankLoaded: false,
                currencyHistoryRankData: '',
                // btt user tab中的帖子列表
                bttUserRelationLoaded: false,
                bttUserRelationLinks: [],
                userRelationLinkActive: null,
                // btt time distribution 中的帖子列表
                bttTimeDistributeLinksLoaded: false,
                bttTimeDistributeLinks: [],
                timeDistributeLinkActive: null,
                // reddit 相关信息
                // reddit post 分页相关配置
                REDDITDAYSDROPDOWN: REDDITDAYSDROPDOWN,
                REDDITPOSTSORTFIELD: REDDITPOSTSORTFIELD,
                REDDITPOSTEXPRESSION: REDDITPOSTEXPRESSION,
                redditPostCurrentPage: 1,
                redditPostCurrentNum: 10,
                redditCurrentPostDays: null,
                redditPostCurrentDayIndex: 3,
                redditPostCurrentSortIndex: 0,
                redditPostCurrentExpressionIndex: 0,
                redditPostCurrentSort: 'num_comments',
                redditPostCount: 0,
                redditLink: [],
                redditPostTimeDistribution: null,
                redditUser: null,
                subReddit: [],
                //github项目
                githubProject: [],
                githubUser: [],
                //tags
                tagList: [],
                //stat comment activity
                githubCommitSCA: null,
                githubCommitSCF: null,
                xtokenEventList: [],
                eventType: consts.eventType,
                // 控制各个卡片是否显示的标志位
                noteShow: true,
                bttShow: true,
                redditShow: true,
                githubShow: true,
                XtokenShow: true,
                bttCardShow: true,
                redditCardShow: false,
                githubCardShow: false,
                xtokenCardShow: true,
                // 控制卡片遮罩层显示的标志位
                redditPostTableLoading: true,
                priceCardLoading: true,
                bttCardLoading: true,
                redditCardLoading: true,
                githubCardLoading: true,
                xtokenCardLoading: true,
            }
        },
        watch: {
            redditPostCurrentDayIndex: function(val){
                let d = this.REDDITDAYSDROPDOWN[val]['days']
                try{
                    this.drawRedditPostTimeDistributeChart()
                }
                catch(e){
                    console.log(e)
                }
                this.getRedditPosts(1, this.redditPostCurrentNum, this.redditPostCurrentSort, d)
            },
            redditPostCurrentSortIndex: function(val){
                let f = this.REDDITPOSTSORTFIELD[val]['field']
                this.getRedditPosts(1, this.redditPostCurrentNum, f, this.redditCurrentPostDays)
            },
            redditPostCurrentExpressionIndex: function(val){
                if(val === 1){
                    if(this.redditPostTimeDistribution === null){
                        this.getSubredditTimeDistribute('link').then(res => {
                            this.drawRedditPostTimeDistributeChart()
                        })
                    }else{
                        this.$nextTick(() => {
                            this.drawRedditPostTimeDistributeChart()
                        })
                    }
                }
            },
            topCurrencyChartType: function(val){
                if(val === 2){
                    if(!this.currencyHistoryRankLoaded){
                        this.getCurrencyHistoryRank()
                    }else{
                        this.drawHistoryRank()
                    }
                }else{
                    this.drawPriceChart()
                }
            }
        },
        methods: {
            init () {
                this.getCurrencyPrice()
                this.getXtokenRelatedEvent()
                this.getTagsRelation()
                this.getNoteList()
            },
            // 点击确定添加备注内容
            noteDiaConfirm(){
                this.$alert(`确定添加备注?`, '添加备注', {
                    confirmButtonText: '确定'
                }).then(() => {
                    this.addNoteContent(this.noteForm.desc)
                })
            },
            noteDelConfirm(id){
                this.$alert(`确定删除备注?`, '删除备注', {
                    confirmButtonText: '确定'
                }).then(() => {
                    this.deleteNote(id)
                })
            },
            getNoteList(){
                let url = config.JAVABASEDOMAIN + `/pros/remark/list`
                let data = {
                    currency: this.id,
                }
                let succ = res => {
                    if (!res.errorMsg) {
                        this.noteList = res.result
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            addNoteContent(s){
                let url = config.JAVABASEDOMAIN + `/pros/remark/add`
                let data = {
                    currency: this.id,
                    txt: s
                }
                let succ = res => {
                    if (!res.errorMsg) {
                        this.$message({type: 'success', message: '操作成功！'});
                        this.noteForm.desc = '';
                        this.getNoteList();
                        this.noteDiaVisible = false
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            deleteNote(id){
                let url = config.JAVABASEDOMAIN + `/pros/remark/del`
                let data = {
                    id: id,
                }
                let succ = res => {
                    if (!res.errorMsg) {
                        this.$message({type: 'success', message: '操作成功！'});
                        this.getNoteList()
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取货币的历史排名
            getCurrencyHistoryRank(){
                let url = config.PYTHONBASEDOMAIN + `/currency/history/rank`
                let data = {
                    id: this.id
                }
                let succ = res => {
                    this.currencyHistoryRankLoaded = true
                    this.currencyHistoryRankData = res
                    this.drawHistoryRank()
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取货币相关的tags
            getTagsRelation () {
                let url = config.PYTHONBASEDOMAIN + `/currency/tags/relation`
                let data = {
                    currency_id: this.id
                }
                let succ = res => {
                    this.tagList = res
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取btt中的用户关联关系数据
            getBttUserRelation (link_id, index) {
                if (this.userRelationLinkActive === index) {
                    return
                }
                let url = config.PYTHONBASEDOMAIN + `/bitcointalk/user/relation`
                let data = {
                    link_id: link_id
                }
                let succ = res => {
                    this.drawBTTUserRelation(res)
                    this.userRelationLinkActive = index
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取分析过用户关联关系的帖子
            getBttUserRelationLinks () {
                let url = config.PYTHONBASEDOMAIN + `/bitcointalk/user/relation/links`
                let data = {
                    currency_name: this.currencyPrice['name']
                }
                let succ = res => {
                    this.bttUserRelationLoaded = true
                    this.bttUserRelationLinks = res
                    if (res !== null && res.length > 0) {
                        this.getBttUserRelation(res[0].id, 0)
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取随时间分布的价格和评论数量数据
            getBttTimeDistributeData(link_id, index){
                let url = config.PYTHONBASEDOMAIN + `/bitcointalk/comment/time/distribute`
                let data = {
                    link_id: link_id
                }
                let succ = res => {
                    this.drawBttCommentTiemDistributeChart(res)
                    this.timeDistributeLinkActive = index
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取分析过时间分布的帖子
            getBttTimeDistributeLinks(){
                let url = config.PYTHONBASEDOMAIN + `/bitcointalk/time/distribute/links`
                let data = {
                    currency_name: this.currencyPrice['name']
                }
                let succ = res => {
                    this.bttTimeDistributeLinksLoaded = true
                    this.bttTimeDistributeLinks = res
                    if (res !== null && res.length > 0) {
                        this.getBttTimeDistributeData(res[0].id, 0)
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取关联的btt帖子
            getBttLinks () {
                let url = config.PYTHONBASEDOMAIN + `/bitcointalk/link`
                let data = {
                    currency_name: this.currencyPrice['name']
                }
                let succ = res => {
                    this.bttCardLoading = false
                    this.bttLink = res.data
                    this.bttCardShow = true
                }
                let fail = res => {
                    this.bttCardLoading = false
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取关联的reddit帖子
            getRedditPosts (page, num=10, sort_field='num_comments', days=null) {
                let url = config.PYTHONBASEDOMAIN + `/reddit/post`
                let data = {
                    sr_name: this.subReddit[0]['display_name'],
                    sort_field: sort_field,
                    page: page,
                    num: num
                }
                if(days){
                    data['days'] = days
                }
                let succ = res => {
                    this.redditPostTableLoading = false
                    this.redditCurrentPostDays = days
                    this.redditPostCurrentPage = page
                    this.redditPostCurrentNum = num
                    this.redditPostCurrentSort = sort_field
                    this.redditPostCount = res['count']
                    this.redditLink = res.data
                    this.redditCardLoading = false
                }
                let fail = res => {
                    this.redditPostTableLoading = false
                    this.redditCardLoading = false
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                this.redditPostTableLoading = true
                net_util.getRequest(url, data, succ, fail)
            },
            // reddit post 选择时间
            handleRedditPostDaysCommand(command){
                REDDITDAYSDROPDOWN.forEach((item, index) => {
                    if(item.command === command){
                        this.redditPostCurrentDayIndex = index
                    }
                })
            },
            // reddit post 列表分页相关的方法
            handleRedditPostSortCommand(command){
                REDDITPOSTSORTFIELD.forEach((item, index) => {
                    if(item.command === command){
                        this.redditPostCurrentSortIndex = index
                    }
                })
            },
            handleRedditPostExpressionCommand(command){
                REDDITPOSTEXPRESSION.forEach((item, index) => {
                    if(item.command === command){
                        this.redditPostCurrentExpressionIndex = index
                    }
                })
            },
            // 获取subreddit中发帖或者评论的日分布图
            getSubredditTimeDistribute(type){
                return new Promise((resovle, reject) => {
                    let url = config.PYTHONBASEDOMAIN + `/stat/reddit/distribute`
                    let data = {
                        type: type,
                        sr_name: this.subReddit[0]['display_name']
                    }
                    let succ = res => {
                        this.redditPostTimeDistribution = JSON.parse(res)
                        resovle(res)
                    }
                    let fail = res => {
                        this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                        reject(res)
                    }
                    net_util.getRequest(url, data, succ, fail)
                })
            },
            handleRedditPostPageChange(val){
                if(val !== this.redditPostCurrentPage){
                    this.getRedditPosts(val, this.redditPostCurrentNum, this.redditPostCurrentSort, this.redditCurrentPostDays)
                }
            },
            handleRedditPostSizeChange(val){
                this.getRedditPosts(1, val, this.redditPostCurrentSort, this.redditCurrentPostDays)
            },
            // 获取reddit key user 列表
            getRedditKeyUser () {
                let url = config.PYTHONBASEDOMAIN + `/reddit/keyuser`
                let data = {
                    currency_name: this.currencyPrice['name'],
                }
                let succ = res => {
                    this.redditUser = res
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取subreddit的基本信息
            getSubReddit () {
                let url = config.PYTHONBASEDOMAIN + `/reddit/subreddit`
                let data = {
                    currency_name: this.currencyPrice['name']
                }
                let succ = res => {
                    this.subReddit = res.data
                    if (this.subReddit.length > 0) {
                        this.redditCardShow = true
                        this.getRedditPosts()
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取GitHub项目的基本信息
            getGithubProject () {
                let url = config.PYTHONBASEDOMAIN + `/github/project`
                let data = {
                    currency_name: this.currencyPrice['name']
                }
                let succ = res => {
                    this.githubProject = res.data
                    if (this.githubProject.length > 0) {
                        this.githubCardShow = true
                        this.getGithubUser()
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取对GitHub提交过代码的人的基本信息
            getGithubUser () {
                let url = config.PYTHONBASEDOMAIN + `/github/user`
                let data = {
                    currency_name: this.currencyPrice['name']
                }
                let succ = res => {
                    this.githubCardLoading = false
                    this.githubUser = res
                    this.$nextTick(function () {
                        let max = 0
                        res[0]['weeks'].forEach(item => {
                            max = Math.max(item.c, max)
                        })
                        res.forEach((item, index) => {
                            this.drawGithubUserCommit(item.weeks, index, max)
                        })
                    })
                }
                let fail = res => {
                    this.githubCardLoading = false
                    this.$message({type: 'error', message: (res.responseJSON && res.responseJSON.message) || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取GitHub sca分析的数据
            getGithubCommitSCA (project_id) {
                let url = config.PYTHONBASEDOMAIN + `/github/stat`
                let data = {
                    project_id: project_id,
                    type: 'sca'
                }
                let succ = res => {
                    this.githubCommitSCA = res
                    this.drawSCA(res)
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取GitHub code frequency的基本信息
            getGithubCodeFrequency(project_id){
                let url = config.PYTHONBASEDOMAIN + `/github/stat`
                let data = {
                    project_id: project_id,
                    type: 'scf'
                }
                let succ = res => {
                    this.githubCommitSCF = res
                    this.drawSCF(res)
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            //获取和货币相关的额外信息
            getAdditionalInfo () {
                let url = config.PYTHONBASEDOMAIN + `/currency/addition/info`
                let data = {
                    name: this.currencyPrice['name']
                }
                let succ = res => {
                    if(res.mytoken){
                        this.currencyAdditionInfo_myToken = res['mytoken']
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取货币价格信息
            getCurrencyPrice () {
                let url = config.PYTHONBASEDOMAIN + `/currency/price`
                let data = {
                    id: this.id,
                    history: true
                }
                let succ = res => {
                    this.priceCardLoading = false
                    this.currencyPrice = res['current_price'][0]
                    this.priceList = res['current_price']
                    this.historyPrice = res['history_price']['data']
                    this.drawPriceChart()
                    this.getBttLinks()
                    this.getSubReddit()
                    this.getGithubProject()
                    this.getAdditionalInfo()
                }
                let fail = res => {
                    this.priceCardLoading = false
                    this.$message({type: 'error', message: res.responseJSON.message || this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取和货币相关联的事件列表
            getXtokenRelatedEvent () {
                let url = config.JAVABASEDOMAIN + '/event/site/pros/list'
                let data = {
                    id: this.id
                }
                let succ = res => {
                    if (!res.errorMsg) {
                        this.xtokenEventList = res.result
                        this.getAllXtokenEventStat()
                        this.xtokenCardLoading = false
                    } else {
                        this.xtokenCardLoading = false
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.xtokenCardLoading = false
                    this.$message({type: 'error', message: this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 获取事件投票情况
            getAllXtokenEventStat () {
                for (let i = 0; i < this.xtokenEventList.length; i++) {
                    if (this.xtokenEventList[i]['roseFall'] === 1) {
                        this.getXtokenEventStat(this.xtokenEventList[i]['id'], 0, i)
                    }
                    if (this.xtokenEventList[i]['trueFalse'] === 1) {
                        this.getXtokenEventStat(this.xtokenEventList[i]['id'], 1, i)
                    }
                }
            },
            getXtokenEventStat (id, type, index) {
                function calcPercent(stat){
                    let all0Num = stat.all0Num
                    let all1Num = stat.all1Num
                    let count = all0Num + all1Num
                    if(count === 0){
                        stat.all0Percent = '--'
                        stat.all1Percent = '--'
                    }else{
                        stat.all0Percent = (all0Num / count) * 100 + '%'
                        stat.all1Percent = (all1Num / count) * 100 + '%'
                    }
                    return stat
                }
                let url = config.JAVABASEDOMAIN + '/event/site/vote/stat'
                let data = {
                    eventId: id,
                    type: type
                }
                let succ = res => {
                    if (!res.errorMsg) {
                        if (type === 0) {
                            this.xtokenEventList[index]['roseFallStat'] = calcPercent(res.result)
                        } else {
                            this.xtokenEventList[index]['trueFalseStat'] = calcPercent(res.result)
                        }
                    } else {
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.$message({type: 'error', message: this.$t('error')})
                }
                net_util.getRequest(url, data, succ, fail)
            },
            // 计算投票结果
            calcVoteState (item) {
                let state = [
                    {type: 0, text: this.$t('page.currencyDetail.t11')},
                    {type: 1, text: this.$t('page.currencyDetail.t12')},
                    {type: 2, text: this.$t('page.currencyDetail.t13')}
                ]
                let now = new Date()
                let start = item.voteStartTime
                let end = item.voteEndTime
                if (now < start) {
                    return state[0].text
                } else if (now > end) {
                    return state[2].text
                } else {
                    return state[1].text
                }
            },
            // 点击btt card中tab的回调函数
            bttTabClick (item) {
                if (item.index == 1 && !this.bttUserRelationLoaded) {
                    this.getBttUserRelationLinks()
                }
                if (item.index == 2 && !this.bttTimeDistributeLinksLoaded){
                    this.getBttTimeDistributeLinks()
                }
            },
            // 点击reddit card中tab的回调函数
            redditTabClick (item) {
                if (item.index == 1 && this.redditUser == null) {
                    this.getRedditKeyUser()
                }
            },
            // 点击GitHub card中tab的回调函数
            githubTabClick (item) {
                if (item.index == 1 && this.githubCommitSCA == null) {
                    this.getGithubCommitSCA(this.githubProject[0]['id'])
                }
                if (item.index == 2 && this.githubCommitSCF == null){
                    this.getGithubCodeFrequency(this.githubProject[0]['id'])
                }
            },
            //使用echarts绘制货币历史排名图表
            drawHistoryRank(){
                let myChart = echarts.init(this.$refs.topCurrencyChart)
                myChart.clear()
                let marketCapRank = this.currencyHistoryRankData
                let rank = marketCapRank.map((item, index) => {
                    return {
                        name: new Date(item[0] * 1000),
                        value: [this.getSmpFormatDateByLong(item[0] * 1000), item[1]+1]
                    }
                })
                let total = marketCapRank.map((item, index) => {
                    return {
                        name: new Date(item[0] * 1000),
                        value: [this.getSmpFormatDateByLong(item[0] * 1000), item[2]]
                    }
                })
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    axisPointer: {
                        link: {xAxisIndex: 'all'},
                        label: {
                            backgroundColor: '#777'
                        }
                    },
                    legend: {
                        data:['Rank', 'Total']
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            yAxisIndex: 0,
                            filterMode: 'empty',
                            left: 20
                        },
                        {
                            type: 'slider',
                            xAxisIndex: 0,
                            filterMode: 'empty',
                            bottom: 0
                        }
                    ],
                    xAxis: [
                        {
                            type: 'time',
                            splitLine: {
                                show: false
                            },
                            min: 'dataMin',
                            max: 'dataMax',
                            axisLine:{
                                onZero: false
                            },
                            axisPointer: {
                                z: 100
                            },
                            position: 'bottom'
                        },
                    ],
                    yAxis:[
                        {
                            type: 'value',
                            position: 'left',
                            //name: 'Rank',
                            splitLine: {
                                show: false
                            },
                            inverse: true
                        },
                        {
                            type: 'value',
                            position: 'right',
                            name: 'Total',
                            splitLine: {
                                show: false
                            },
                        },
                    ],
                    series: [
                        {
                            name:'Rank',
                            type:'line',
                            data: rank,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                }
                            },
                        },
                        {
                            name:'Total',
                            type:'line',
                            data:total,
                            yAxisIndex: 1,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                }
                            },
                        },
                    ]
                })
            },
            // 使用echarts绘制项目代码每周更新频率
            drawSCA (sca_data) {
                let myChart = echarts.init(this.$refs.SCACharts)
                myChart.clear()
                let dataAxis = []
                let data = []
                sca_data.forEach(item => {
                    data.push(item.total)
                    dataAxis.push(this.getSmpFormatDateByLong(item.week * 1000, false))
                })
                myChart.setOption({
                    xAxis: {
                        data: dataAxis,
                        axisLabel: {
                            inside: false,
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true
                        },
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#999'
                            }
                        }
                    },
                    series: [
                        {
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: '#ff7c1f'
                                }
                            },
                            data: data
                        }]
                })
            },
            // 使用echarts绘制项目代码addition and deletion
            drawSCF(scf_data){
                let myChart = echarts.init(this.$refs.SCFCharts);
                myChart.clear();
                let timeData = [];
                let data_addition = [];
                let data_deletion = [];
                scf_data.forEach(item => {
                    timeData.push(this.getSmpFormatDateByLong(item[0]*1000, false));
                    data_addition.push(item[1]);
                    data_deletion.push(item[2]);
                });
                myChart.setOption({
                    legend: {
                        data:['addition','deletion'],
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    dataZoom: {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100,
                    },
                    xAxis: [{
                        type : 'category',
                        boundaryGap : true,
                        axisTick: {show: true},
                        axisLine: {onZero: true},
                        data: timeData
                    }],
                    yAxis: [{
                        type : 'value',
                    }],
                    series: [{
                        name:'addition',
                        type:'line',
                        showSymbol: false,
                        data: data_addition,
                        lineStyle: {
                            normal: {
                                width: 1,
                                color: '#2cbe4e',
                                borderWidth: 0
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#2cbe4e'
                                }, {
                                    offset: 1,
                                    color: '#2cbe4e'
                                }])
                            }
                        },
                    },{
                        name:'deletion',
                        type:'line',
                        showSymbol: false,
                        data: data_deletion,
                        lineStyle: {
                            normal: {
                                width: 1,
                                color: '#cb2431',
                                borderWidth: 0
                            },
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#cb2431'
                                }, {
                                    offset: 1,
                                    color: '#cb2431'
                                }])
                            }
                        },
                    }]
                });
            },
            // 使用echarts绘制用户代码贡献图表
            drawGithubUserCommit (user_commit_data, index, max) {
                let chart = echarts.init(this.$refs['user_commit_chart' + index][0])
                let dateList = []
                let valueList = []
                user_commit_data.forEach(item => {
                    dateList.push(item.w)
                    valueList.push(item.c)
                })
                chart.setOption({
                    xAxis: {
                        show: false,
                        data: dateList
                    },
                    yAxis: {
                        max: max,
                        show: false,
                        splitLine: {show: false}
                    },
                    series: {
                        type: 'line',
                        showSymbol: false,
                        data: valueList,
                        lineStyle: {
                            normal: {
                                width: 1,
                                color: 'rgba(251, 133, 50, 0.5)'
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: '#fb8532'
                            }
                        },
                        smooth: true
                    }
                })
            },
            // 使用echarts绘制用户关系图
            drawBTTUserRelation (res) {
                let users = JSON.parse(res.user)
                let relations = JSON.parse(res.relation)
                let categories =JSON.parse(res.categories)
                let category_keys = Object.keys(categories)
                let category_indexes = consts.GRADE_ORDER
                //将legend的数据按照特定的顺序排列
                category_keys.forEach((item, index) => {
                    categories[item] = -1
                })
                category_keys.forEach((item, index) => {
                    for(let i=0; i<category_indexes.length; i++ ){
                        if(category_indexes[i] === item){
                            categories[item] = i
                        }
                    }
                })
                for(let i=0; i<category_keys.length; i++){
                    for(let j=0; j<category_keys.length - i -1; j++){
                        if(categories[category_keys[j]] > categories[category_keys[j+1]]){
                            let temp = category_keys[j]
                            category_keys[j] = category_keys[j+1]
                            category_keys[j+1] = temp
                        }
                    }
                }
                let sorted_categories = category_keys.map(function (item) {
                    return {name: item}
                })
                let myChart = echarts.init(this.$refs.userRelationChart)
                myChart.clear()
                myChart.setOption({
                    color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                    title: {
                        text: 'Top 100 active users',
                        top: 'top',
                        left: 'center'
                    },
                    tooltip: {
                        formatter: params => {return `name: ${params['data']['name']} <br />  grade: ${params['data']['category']} <br /> symbolSize: ${params['data']['symbolSize']}`}
                    },
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    legend: [{
                        data: sorted_categories.map(function (item) {
                            return item.name
                        }),
                        orient: 'vertical',
                        left: 0,
                        top: 0
                    }],
                    series: [{
                        type: 'graph',
                        layout: 'circular',
                        circular: {
                            rotateLabel: true
                        },
//                        layout: 'force',
                        data: users.map(function (node) {
                            return {
                                id: node.user_id,
                                name: node.author,
                                category: node.grade,
                                symbolSize: node.num,
                            }
                        }),
                        links: relations.map(function (edge) {
                            return {
                                source: edge.source,
                                target: edge.target
                            }
                        }),
                        categories: sorted_categories,
                        label: {
                            normal: {
                                position: 'right',
//                                show: true
                            }
                        },
                        focusNodeAdjacency: true,
                        lineStyle: {
                            normal: {
                                color: 'source',
                                curveness: 0.3,
                            }
                        },
                    }]
                })
                myChart.on('click', params => {
                    let query = {
                        user_id: params['data']['id'],
                        user_name: params['data']['name']
                    }
                    this.$router.push({path: '/btt/user/history', query: query})
                })
            },
            // 使用echarts绘制btt中评论随时间的分布图
            drawBttCommentTiemDistributeChart(res){
                let myChart = echarts.init(this.$refs.historyPriceChart)
                myChart.clear()
                let colors = []
                let price_btc = []
                let price_usd = []
                let comment_dis = []
                let history_price = JSON.parse(this.historyPrice)
                if(res.data){
                    let arr = JSON.parse(res.data)
                    arr.forEach((item, index) => {
                        let t = this.getGMT8Time(item[0])
                        comment_dis.push({
                            name: t,
                            value: [this.getSmpFormatDateByLong(t.getTime()),
                            item[1]]
                        })
                    })
                }
                history_price['price_btc'].forEach((item, index) => {
                    let t = this.getGMT8Time(item[0])
                    price_btc.push({
                        name: t,
                        value: [
                            this.getSmpFormatDateByLong(t.getTime()),
                            item[1]
                        ]
                    })
                })
                history_price['price_usd'].forEach((item, index) => {
                    let t = this.getGMT8Time(item[0])
                    price_usd.push({
                        name: t,
                        value: [
                            this.getSmpFormatDateByLong(t.getTime()),
                            item[1]
                        ]
                    })
                })
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    axisPointer: {
                        link: {xAxisIndex: 'all'},
                        label: {
                            backgroundColor: '#777'
                        }
                    },
                    legend: {
                        data:['price_btc', 'price_usd', 'comment_num']
                    },
                    xAxis: [
                        {
                            type: 'time',
                            splitLine: {
                                show: false
                            },
                            min: 'dataMin',
                            max: 'dataMax',
                            axisPointer: {
                                z: 100
                            }
                        },
                    ],
                    yAxis:[
                        {
                            type: 'value',
                            position: 'left',
                            name: 'price_btc',
                            splitLine: {
                                show: false
                            },
                        },
                        {
                            type: 'value',
                            position: 'right',
                            name: 'price_usd',
                            splitLine: {
                                show: false
                            },
                        },
                        {
                            type: 'value',
                            position: 'right',
                            offset: 60,
                            name: 'comments',
                            splitLine: {
                                show: false
                            },
                        },
                    ],
                    series: [
                        {
                            name:'price_btc',
                            type:'line',
                            data: price_btc,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                }
                            },
                        },
                        {
                            name:'price_usd',
                            type:'line',
                            data:price_usd,
                            yAxisIndex: 1,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                }
                            },
                        },
                        {
                            name:'comment_num',
                            type:'line',
                            data:comment_dis,
                            yAxisIndex: 2,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                }
                            },
                        },
                    ]
                })
            },
            // 绘制货币历史价格图
            drawPriceChart(){
                let myChart = echarts.init(this.$refs.topCurrencyChart);
                myChart.clear();
                let price_btc = [];
                let price_usd = [];
                let time_data_btc = [];
                let time_data_usd = [];
                let history_price = JSON.parse(this.historyPrice);
                history_price['price_btc'].forEach((item) => {
                    let t = this.getGMT8Time(item[0]);
                    let long_t = t.getTime();
                    if(!(time_data_btc.indexOf(long_t) > -1)){
                        time_data_btc.push(long_t);
                        price_btc.push({
                            name: t,
                            value: [
                                this.getSmpFormatDateByLong(long_t),
                                item[1]
                            ]
                        })
                    }
                });
                history_price['price_usd'].forEach((item) => {
                    let t = this.getGMT8Time(item[0]);
                    let long_t = t.getTime();
                    if(!(time_data_usd.indexOf(long_t) > -1)){
                        time_data_usd.push(long_t);
                        price_usd.push({
                            name: t,
                            value: [
                                this.getSmpFormatDateByLong(t.getTime()),
                                item[1]
                            ]
                        })
                    }
                });
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    axisPointer: {
                        link: {xAxisIndex: 'all'},
                        label: {
                            backgroundColor: '#777'
                        }
                    },
                    legend: {
                        data:['price_btc', 'price_usd', 'comment_num']
                    },
                    xAxis: [
                        {
                            type: 'time',
                            splitLine: {
                                show: false
                            },
                            min: 'dataMin',
                            max: 'dataMax',
                            axisPointer: {
                                z: 100
                            }
                        },
                    ],
                    yAxis:[
                        {
                            type: 'value',
                            position: 'left',
                            name: 'price_btc',
                            splitLine: {
                                show: false
                            },
                        },
                        {
                            type: 'value',
                            position: 'right',
                            name: 'price_usd',
                            splitLine: {
                                show: false
                            },
                        },
                    ],
                    series: [
                        {
                            name:'price_btc',
                            type:'line',
                            data: price_btc,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                }
                            },
                        },
                        {
                            name:'price_usd',
                            type:'line',
                            data:price_usd,
                            yAxisIndex: 1,
                            showSymbol: false,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                }
                            },
                        },
                    ]
                })
            },
            // subreddit中发帖或评论的日分布图
            drawRedditPostTimeDistributeChart(){
                let i = Math.min(this.REDDITDAYSDROPDOWN[this.redditPostCurrentDayIndex]['days'], 180)
                let data = this.redditPostTimeDistribution.slice(-i, -1)
                let dx = []
                let dy = []
                data.forEach(d => {
                    dx.push(this.getSmpFormatDateByLong(d[0], false))
                    dy.push(d[1])
                })
                let dom = document.getElementById('redditPostDistributeChart')
                let myChart = echarts.init(dom)
                myChart.clear()
                myChart.setOption({
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    toolbox: {
                        feature: {
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : dx,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            type:'bar',
                            data: dy
                        }
                    ]
                })
            },
            // 控制各个card的显示和收起
            toggleBttSpan () {
                this.bttShow = !this.bttShow
            },
            toggleRedditSpan () {
                this.redditShow = !this.redditShow
            },
            toggleGithubSpan () {
                this.githubShow = !this.githubShow
            },
            toggleXtokenSpan () {
                this.XtokenShow = !this.XtokenShow
            },
            toPriceContrast(){
                let query = {
                    id: this.id,
                };
                this.$router.push({path: '/price_contrast', query: query})
            },
            customerParseFloat: utils.customerParseFloat,
            getSmpFormatDateByLong: utils.getSmpFormatDateByLong,
            getDateDiff: utils.getDateDiff,
            getGMT8Time(t){
                let d = new Date(t)
                d.setHours(8)
                d.setMinutes(0)
                d.setSeconds(0)
                return d
            }
        },
        mounted () {
            this.id = this.$route.query.id
            this.init()
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .top
        .card
            height 680px
            padding 0
        .details
            .head
                padding 20px
                height 80px
                background:#fafafa;
                .info
                    .name
                        font-size:40px;
                        color:#4a4a4a;
                    .ico-info
                        font-size:14px;
                        color:#999999;

                .tag
                    margin 20px 0
                    li
                        display inline-block
                        line-height 20px
                        font-size:16px;
                        color:#20a0ff;
                        margin-right 30px
            .content
                padding 20px
                .price
                    ul
                        li
                            display block
                            line-height 20px
                            font-size 18px
                            padding 10px 0
                            span
                                display inline-block
                        .title
                            width 120px
                            color:#999999;
                .links
                    margin-top 20px
                    ul
                        li
                            line-height 30px
                            margin 10px 0
                            .logo
                                width 30px
                                height 30px
                                vertical-align middle
                            span
                                font-size 18px
                                color #20a0ff
                                margin-left 10px
        .charts
            .head
                padding 10px 40px
                .price_contrast
                    color #409eff
                    border 1px solid #409eff
                    border-radius 20px
                    line-height 20px
                    padding 5px 10px
                    cursor pointer
                button
                    margin-right 20px
                    position relative
                    outline none
                    border none
                    background none
                    font-size 18px
                    color #999999
                    line-height 20px
                    height 60px
                    cursor: pointer
                .active
                    color #409eff
                    &:after
                        content ""
                        display inline-block
                        position absolute
                        bottom 0
                        width 40px
                        height 4px
                        left calc(50% - 20px)
                        background #409eff

            .content
                padding 20px
                .currency-chart
                    width 100%
                    height 550px

    .note, .btt, .reddit, .xtoken, .github
        padding 0

    .note
        .collapse-body
            padding 0
            .ctl
                padding 10px 20px
                button
                    padding 10px 20px 10px 30px
                    position relative
                    border none
                    outline none
                    background-color #88db49
                    color #FFF
                    cursor pointer
                    border-radius 2px
                    &:hover
                        opacity .8
                    &:after
                        content "+"
                        position absolute
                        left 10px
                        top calc(50% - 10px)
                        font-size 20px
                        line-height 20px
                        color #FFF
            .odd
                background-color #f9fdff
            .cell
                height 60px
                line-height 60px
                display inline-block
            .content
                width calc(100% - 300px)
                p
                    padding 0 20px
                    line-height 20px
                    display inline-block
            .opt
                color #fd4646
                cursor pointer
                &:hover
                    opacity .8
            .date, .opt
                width 150px
                text-align center

    .collapse-head
        height 72px
        background-color #fafafa
        .name
            display inline-block
            line-height 70px
            font-size 18px
            color #38435b
            margin-left 20px
            float left
            img
                width 30px
                margin-top -5px
                margin-right 20px
                vertical-align middle
            a
                font-size 14px
                color gray
        .top-content
            display inline-block
            line-height 70px
            padding-left 100px
            float left
        .top-item
            margin-left 50px
            float left
        .label
            font-size 14px
            color #999999
            margin-left 10px
        .right-icon
            float right
            line-height 70px
            color #d8d8d8
            margin-right 15px
            &:hover
                color #565454
            i
                font-size 32px
                line-height 70px
                cursor pointer

    .collapse-body
        min-height 200px
        padding 20px

    .github-user
        height 80px
        &:hover
            background-color #fafafa
        .info
            display inline-block
            float left
        .detail
            margin-left 10px
            .name
                font-size 20px
            p
                font-size 14px
                margin 5px 0
        .avatar
            display inline-block
            overflow hidden
            line-height 1
            vertical-align middle
            border-radius 3px
            height 48px
            width 48px
        .user_commit_chart
            width 300px
            height 60px
            display inline-block
            float right

    .link-content
        a
            font-size 16px
            color #333333
            cursor pointer
            &:hover
                color #409EFF
        .line
            margin 10px 0
            line-height 30px
            &:hover
                background-color #fafafa
        .title
            display inline-block
            max-width 600px
        .info
            display inline-block
            float right
        .small-text
            font-size 14px
            color #333333
        .tag
            font-size 12px
            color #409EFF

    .sca-charts
        width 780px
        height 400px

    .user-relation-pane
        ul
            vertical-align top
            li
                line-height 25px
                font-size 16px
                font-weight normal
                padding 10px
                cursor pointer
                &:hover
                    background-color #fafafa
            .active
                color #409EFF

    .tab
        display inline-block
        width 100%

    .Pagination
        margin 10px
        text-align right
        .left
            float left

</style>
