


<!DOCTYPE html>
<html>
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# githubog: http://ogp.me/ns/fb/githubog#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>three.js/examples/js/Detector.js at master · mrdoob/three.js · GitHub</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub" />
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

    
    

    <meta content="authenticity_token" name="csrf-param" />
<meta content="PJqi2qY4hQrn0lezmKlVnamICiRwZJYPgT6IxFAhcgI=" name="csrf-token" />

    <link href="https://a248.e.akamai.net/assets.github.com/stylesheets/bundles/github-c4b3a1e3484da7dab93ea4f6caca07a0168ffa77.css" media="screen" rel="stylesheet" type="text/css" />
    <link href="https://a248.e.akamai.net/assets.github.com/stylesheets/bundles/github2-34d96ae148c427d3106177152ac475d7df36c780.css" media="screen" rel="stylesheet" type="text/css" />
    

    <script src="https://a248.e.akamai.net/assets.github.com/javascripts/bundles/jquery-5b140862bd914d3619171dece9be92269c2b1fe1.js" type="text/javascript"></script>
    <script src="https://a248.e.akamai.net/assets.github.com/javascripts/bundles/github-1191d9500b9368ede4221610a2d9c453c0cb35f8.js" type="text/javascript"></script>
    

      <link rel='permalink' href='/mrdoob/three.js/blob/32b581f24fddeaf9e91b7825aa93ec0ad3a45c83/examples/js/Detector.js'>
    <meta property="og:title" content="three.js"/>
    <meta property="og:type" content="githubog:gitrepository"/>
    <meta property="og:url" content="https://github.com/mrdoob/three.js"/>
    <meta property="og:image" content="https://a248.e.akamai.net/assets.github.com/images/gravatars/gravatar-140.png?1329275975"/>
    <meta property="og:site_name" content="GitHub"/>
    <meta property="og:description" content="three.js - JavaScript 3D library"/>

    <meta name="description" content="three.js - JavaScript 3D library" />
  <link href="https://github.com/mrdoob/three.js/commits/master.atom" rel="alternate" title="Recent Commits to three.js:master" type="application/atom+xml" />

  </head>


  <body class="logged_out page-blob  vis-public env-production " data-blob-contribs-enabled="yes">
    
    
    

      <div id="header" class="true clearfix">
        <div class="container clearfix">
          <a class="site-logo" href="https://github.com">
            <!--[if IE]>
            <img alt="GitHub" class="github-logo" src="https://a248.e.akamai.net/assets.github.com/images/modules/header/logov7.png?1323882799" />
            <img alt="GitHub" class="github-logo-hover" src="https://a248.e.akamai.net/assets.github.com/images/modules/header/logov7-hover.png?1324325436" />
            <![endif]-->
            <img alt="GitHub" class="github-logo-4x" height="30" src="https://a248.e.akamai.net/assets.github.com/images/modules/header/logov7@4x.png?1323882799" />
            <img alt="GitHub" class="github-logo-4x-hover" height="30" src="https://a248.e.akamai.net/assets.github.com/images/modules/header/logov7@4x-hover.png?1324325436" />
          </a>

                  <!--
      make sure to use fully qualified URLs here since this nav
      is used on error pages on other domains
    -->
    <ul class="top-nav logged_out">
        <li class="pricing"><a href="https://github.com/plans">Signup and Pricing</a></li>
        <li class="explore"><a href="https://github.com/explore">Explore GitHub</a></li>
      <li class="features"><a href="https://github.com/features">Features</a></li>
        <li class="blog"><a href="https://github.com/blog">Blog</a></li>
      <li class="login"><a href="https://github.com/login?return_to=%2Fmrdoob%2Fthree.js%2Fblob%2Fmaster%2Fexamples%2Fjs%2FDetector.js">Login</a></li>
    </ul>



          
        </div>
      </div>

      

            <div class="site">
      <div class="container">
        <div class="pagehead repohead instapaper_ignore readability-menu">
        <div class="title-actions-bar">
          <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
<a href="/mrdoob" itemprop="url">            <span itemprop="title">mrdoob</span>
            </a> /
            <strong><a href="/mrdoob/three.js" class="js-current-repository">three.js</a></strong>
          </h1>
          



              <ul class="pagehead-actions">


          <li><a href="/login?return_to=%2Fmrdoob%2Fthree.js" class="minibutton btn-watch watch-button entice tooltipped leftwards" rel="nofollow" title="You must be logged in to use this feature"><span><span class="icon"></span>Watch</span></a></li>
          <li><a href="/login?return_to=%2Fmrdoob%2Fthree.js" class="minibutton btn-fork fork-button entice tooltipped leftwards" rel="nofollow" title="You must be logged in to use this feature"><span><span class="icon"></span>Fork</span></a></li>


      <li class="repostats">
        <ul class="repo-stats">
          <li class="watchers ">
            <a href="/mrdoob/three.js/watchers" title="Watchers" class="tooltipped downwards">
              5,493
            </a>
          </li>
          <li class="forks">
            <a href="/mrdoob/three.js/network" title="Forks" class="tooltipped downwards">
              602
            </a>
          </li>
        </ul>
      </li>
    </ul>

        </div>

          

  <ul class="tabs">
    <li><a href="/mrdoob/three.js" class="selected" highlight="repo_sourcerepo_downloadsrepo_commitsrepo_tagsrepo_branches">Code</a></li>
    <li><a href="/mrdoob/three.js/network" highlight="repo_networkrepo_fork_queue">Network</a>
    <li><a href="/mrdoob/three.js/pulls" highlight="repo_pulls">Pull Requests <span class='counter'>7</span></a></li>

      <li><a href="/mrdoob/three.js/issues" highlight="repo_issues">Issues <span class='counter'>120</span></a></li>

      <li><a href="/mrdoob/three.js/wiki" highlight="repo_wiki">Wiki <span class='counter'>17</span></a></li>

    <li><a href="/mrdoob/three.js/graphs" highlight="repo_graphsrepo_contributors">Stats &amp; Graphs</a></li>

  </ul>

  
<div class="frame frame-center tree-finder" style="display:none"
      data-tree-list-url="/mrdoob/three.js/tree-list/32b581f24fddeaf9e91b7825aa93ec0ad3a45c83"
      data-blob-url-prefix="/mrdoob/three.js/blob/32b581f24fddeaf9e91b7825aa93ec0ad3a45c83"
    >

  <div class="breadcrumb">
    <span class="bold"><a href="/mrdoob/three.js">three.js</a></span> /
    <input class="tree-finder-input js-navigation-enable" type="text" name="query" autocomplete="off" spellcheck="false">
  </div>

    <div class="octotip">
      <p>
        <a href="/mrdoob/three.js/dismiss-tree-finder-help" class="dismiss js-dismiss-tree-list-help" title="Hide this notice forever" rel="nofollow">Dismiss</a>
        <span class="bold">Octotip:</span> You've activated the <em>file finder</em>
        by pressing <span class="kbd">t</span> Start typing to filter the
        file list. Use <span class="kbd badmono">↑</span> and
        <span class="kbd badmono">↓</span> to navigate,
        <span class="kbd">enter</span> to view files.
      </p>
    </div>

  <table class="tree-browser" cellpadding="0" cellspacing="0">
    <tr class="js-header"><th>&nbsp;</th><th>name</th></tr>
    <tr class="js-no-results no-results" style="display: none">
      <th colspan="2">No matching files</th>
    </tr>
    <tbody class="js-results-list js-navigation-container">
    </tbody>
  </table>
</div>

<div id="jump-to-line" style="display:none">
  <h2>Jump to Line</h2>
  <form>
    <input class="textfield" type="text">
    <div class="full-button">
      <button type="submit" class="classy">
        <span>Go</span>
      </button>
    </div>
  </form>
</div>


<div class="subnav-bar">

  <ul class="actions subnav">
    <li><a href="/mrdoob/three.js/tags" class="" highlight="repo_tags">Tags <span class="counter">20</span></a></li>
    <li><a href="/mrdoob/three.js/downloads" class="blank downloads-blank" highlight="repo_downloads">Downloads <span class="counter">0</span></a></li>
    
  </ul>

  <ul class="scope">
    <li class="switcher">

      <div class="context-menu-container js-menu-container">
        <a href="#"
           class="minibutton bigger switcher js-menu-target js-commitish-button btn-branch repo-tree"
           data-master-branch="master"
           data-ref="master">
          <span><span class="icon"></span><i>branch:</i> master</span>
        </a>

        <div class="context-pane commitish-context js-menu-content">
          <a href="javascript:;" class="close js-menu-close"></a>
          <div class="context-title">Switch Branches/Tags</div>
          <div class="context-body pane-selector commitish-selector js-filterable-commitishes">
            <div class="filterbar">
              <div class="placeholder-field js-placeholder-field">
                <label class="placeholder" for="context-commitish-filter-field" data-placeholder-mode="sticky">Filter branches/tags</label>
                <input type="text" id="context-commitish-filter-field" class="commitish-filter" />
              </div>

              <ul class="tabs">
                <li><a href="#" data-filter="branches" class="selected">Branches</a></li>
                <li><a href="#" data-filter="tags">Tags</a></li>
              </ul>
            </div>

              <div class="commitish-item branch-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/dev/examples/js/Detector.js" data-name="dev" rel="nofollow">dev</a>
                </h4>
              </div>
              <div class="commitish-item branch-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/master/examples/js/Detector.js" data-name="master" rel="nofollow">master</a>
                </h4>
              </div>

              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r47/examples/js/Detector.js" data-name="r47" rel="nofollow">r47</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r46/examples/js/Detector.js" data-name="r46" rel="nofollow">r46</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r45/examples/js/Detector.js" data-name="r45" rel="nofollow">r45</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r44/examples/js/Detector.js" data-name="r44" rel="nofollow">r44</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r43/examples/js/Detector.js" data-name="r43" rel="nofollow">r43</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r42/examples/js/Detector.js" data-name="r42" rel="nofollow">r42</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r41/ROME/examples/js/Detector.js" data-name="r41/ROME" rel="nofollow">r41/ROME</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r40/examples/js/Detector.js" data-name="r40" rel="nofollow">r40</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r39/examples/js/Detector.js" data-name="r39" rel="nofollow">r39</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r38/examples/js/Detector.js" data-name="r38" rel="nofollow">r38</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r37/examples/js/Detector.js" data-name="r37" rel="nofollow">r37</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r36/examples/js/Detector.js" data-name="r36" rel="nofollow">r36</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r35/examples/js/Detector.js" data-name="r35" rel="nofollow">r35</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r34/examples/js/Detector.js" data-name="r34" rel="nofollow">r34</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r33/examples/js/Detector.js" data-name="r33" rel="nofollow">r33</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r32/examples/js/Detector.js" data-name="r32" rel="nofollow">r32</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r31/examples/js/Detector.js" data-name="r31" rel="nofollow">r31</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r30/examples/js/Detector.js" data-name="r30" rel="nofollow">r30</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r29/examples/js/Detector.js" data-name="r29" rel="nofollow">r29</a>
                </h4>
              </div>
              <div class="commitish-item tag-commitish selector-item">
                <h4>
                    <a href="/mrdoob/three.js/blob/r28/examples/js/Detector.js" data-name="r28" rel="nofollow">r28</a>
                </h4>
              </div>

            <div class="no-results" style="display:none">Nothing to show</div>
          </div>
        </div><!-- /.commitish-context-context -->
      </div>

    </li>
  </ul>

  <ul class="subnav with-scope">

    <li><a href="/mrdoob/three.js" class="selected" highlight="repo_source">Files</a></li>
    <li><a href="/mrdoob/three.js/commits/master" highlight="repo_commits">Commits</a></li>
    <li><a href="/mrdoob/three.js/branches" class="" highlight="repo_branches" rel="nofollow">Branches <span class="counter">2</span></a></li>
  </ul>

</div>

  
  
  


          

        </div><!-- /.repohead -->

        





<!-- block_view_fragment_key: views4/v8/blob:v17:33a47fc1446bb21cac547c72da776ea5 -->
  <div id="slider">

    <div class="breadcrumb" data-path="examples/js/Detector.js/">
      <b itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/mrdoob/three.js/tree/32b581f24fddeaf9e91b7825aa93ec0ad3a45c83" class="js-rewrite-sha" itemprop="url"><span itemprop="title">three.js</span></a></b> / <span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/mrdoob/three.js/tree/32b581f24fddeaf9e91b7825aa93ec0ad3a45c83/examples" class="js-rewrite-sha" itemscope="url"><span itemprop="title">examples</span></a></span> / <span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/mrdoob/three.js/tree/32b581f24fddeaf9e91b7825aa93ec0ad3a45c83/examples/js" class="js-rewrite-sha" itemscope="url"><span itemprop="title">js</span></a></span> / <strong class="final-path">Detector.js</strong> <span class="js-clippy clippy-button " data-clipboard-text="examples/js/Detector.js" data-copied-hint="copied!" data-copy-hint="copy to clipboard"></span>
    </div>


      <div class="commit file-history-tease" data-path="examples/js/Detector.js/">
        <img class="main-avatar" height="24" src="https://secure.gravatar.com/avatar/a00211a1e1aa4fe920302e7b76da0d91?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-140.png" width="24" />
        <span class="author"><a href="/mrdoob">mrdoob</a></span>
        <time class="js-relative-date" datetime="2011-07-03T09:15:27-07:00" title="2011-07-03 09:15:27">July 03, 2011</time>
        <div class="commit-title">
            <a href="/mrdoob/three.js/commit/ce39f2aa41397cc219dc24fa0d8089574d4fff9a" class="message">Detector.js message now pointing to get.webgl.org.</a>
        </div>

        <div class="participation">
          <p class="quickstat"><a href="#blob_contributors_box" rel="facebox"><strong>2</strong> contributors</a></p>
              <a class="avatar tooltipped downwards" title="mrdoob" href="/mrdoob/three.js/commits/master/examples/js/Detector.js?author=mrdoob"><img height="20" src="https://secure.gravatar.com/avatar/a00211a1e1aa4fe920302e7b76da0d91?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-140.png" width="20" /><span class="overlay size-20"></span></a>
    <a class="avatar tooltipped downwards" title="alteredq" href="/mrdoob/three.js/commits/master/examples/js/Detector.js?author=alteredq"><img height="20" src="https://secure.gravatar.com/avatar/05a9ea8209c0f0d038d94865d380b210?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-140.png" width="20" /><span class="overlay size-20"></span></a>


        </div>
        <div id="blob_contributors_box" style="display:none">
          <h2>Users on GitHub who have contributed to this file</h2>
          <ul class="facebox-user-list">
            <li>
              <img height="24" src="https://secure.gravatar.com/avatar/a00211a1e1aa4fe920302e7b76da0d91?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-140.png" width="24" />
              <a href="/mrdoob">mrdoob</a>
            </li>
            <li>
              <img height="24" src="https://secure.gravatar.com/avatar/05a9ea8209c0f0d038d94865d380b210?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-140.png" width="24" />
              <a href="/alteredq">alteredq</a>
            </li>
          </ul>
        </div>
      </div>

    <div class="frames">
      <div class="frame frame-center" data-path="examples/js/Detector.js/" data-permalink-url="/mrdoob/three.js/blob/32b581f24fddeaf9e91b7825aa93ec0ad3a45c83/examples/js/Detector.js" data-title="examples/js/Detector.js at master from mrdoob/three.js - GitHub" data-type="blob">

        <div id="files" class="bubble">
          <div class="file">
            <div class="meta">
              <div class="info">
                <span class="icon"><img alt="Txt" height="16" src="https://a248.e.akamai.net/assets.github.com/images/icons/txt.png?1252203928" width="16" /></span>
                <span class="mode" title="File Mode">100644</span>
                  <span>59 lines (40 sloc)</span>
                <span>1.8 kb</span>
              </div>
              <ul class="button-group actions">
                  <li>
                    <a class="grouped-button file-edit-link minibutton bigger lighter js-rewrite-sha" href="/mrdoob/three.js/edit/32b581f24fddeaf9e91b7825aa93ec0ad3a45c83/examples/js/Detector.js" data-method="post" rel="nofollow"><span>Edit this file</span></a>
                  </li>

                <li>
                  <a href="/mrdoob/three.js/raw/master/examples/js/Detector.js" class="minibutton btn-raw grouped-button bigger lighter" id="raw-url"><span><span class="icon"></span>Raw</span></a>
                </li>
                  <li>
                    <a href="/mrdoob/three.js/blame/master/examples/js/Detector.js" class="minibutton btn-blame grouped-button bigger lighter"><span><span class="icon"></span>Blame</span></a>
                  </li>
                <li>
                  <a href="/mrdoob/three.js/commits/master/examples/js/Detector.js" class="minibutton btn-history grouped-button bigger lighter" rel="nofollow"><span><span class="icon"></span>History</span></a>
                </li>
              </ul>
            </div>
              <div class="data type-javascript">
      <table cellpadding="0" cellspacing="0" class="lines">
        <tr>
          <td>
            <pre class="line_numbers"><span id="L1" rel="#L1">1</span>
<span id="L2" rel="#L2">2</span>
<span id="L3" rel="#L3">3</span>
<span id="L4" rel="#L4">4</span>
<span id="L5" rel="#L5">5</span>
<span id="L6" rel="#L6">6</span>
<span id="L7" rel="#L7">7</span>
<span id="L8" rel="#L8">8</span>
<span id="L9" rel="#L9">9</span>
<span id="L10" rel="#L10">10</span>
<span id="L11" rel="#L11">11</span>
<span id="L12" rel="#L12">12</span>
<span id="L13" rel="#L13">13</span>
<span id="L14" rel="#L14">14</span>
<span id="L15" rel="#L15">15</span>
<span id="L16" rel="#L16">16</span>
<span id="L17" rel="#L17">17</span>
<span id="L18" rel="#L18">18</span>
<span id="L19" rel="#L19">19</span>
<span id="L20" rel="#L20">20</span>
<span id="L21" rel="#L21">21</span>
<span id="L22" rel="#L22">22</span>
<span id="L23" rel="#L23">23</span>
<span id="L24" rel="#L24">24</span>
<span id="L25" rel="#L25">25</span>
<span id="L26" rel="#L26">26</span>
<span id="L27" rel="#L27">27</span>
<span id="L28" rel="#L28">28</span>
<span id="L29" rel="#L29">29</span>
<span id="L30" rel="#L30">30</span>
<span id="L31" rel="#L31">31</span>
<span id="L32" rel="#L32">32</span>
<span id="L33" rel="#L33">33</span>
<span id="L34" rel="#L34">34</span>
<span id="L35" rel="#L35">35</span>
<span id="L36" rel="#L36">36</span>
<span id="L37" rel="#L37">37</span>
<span id="L38" rel="#L38">38</span>
<span id="L39" rel="#L39">39</span>
<span id="L40" rel="#L40">40</span>
<span id="L41" rel="#L41">41</span>
<span id="L42" rel="#L42">42</span>
<span id="L43" rel="#L43">43</span>
<span id="L44" rel="#L44">44</span>
<span id="L45" rel="#L45">45</span>
<span id="L46" rel="#L46">46</span>
<span id="L47" rel="#L47">47</span>
<span id="L48" rel="#L48">48</span>
<span id="L49" rel="#L49">49</span>
<span id="L50" rel="#L50">50</span>
<span id="L51" rel="#L51">51</span>
<span id="L52" rel="#L52">52</span>
<span id="L53" rel="#L53">53</span>
<span id="L54" rel="#L54">54</span>
<span id="L55" rel="#L55">55</span>
<span id="L56" rel="#L56">56</span>
<span id="L57" rel="#L57">57</span>
<span id="L58" rel="#L58">58</span>
</pre>
          </td>
          <td width="100%">
                <div class="highlight"><pre><div class='line' id='LC1'><span class="cm">/**</span></div><div class='line' id='LC2'><span class="cm"> * @author alteredq / http://alteredqualia.com/</span></div><div class='line' id='LC3'><span class="cm"> * @author mr.doob / http://mrdoob.com/</span></div><div class='line' id='LC4'><span class="cm"> */</span></div><div class='line' id='LC5'><br/></div><div class='line' id='LC6'><span class="nx">Detector</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC7'><br/></div><div class='line' id='LC8'>	<span class="nx">canvas</span> <span class="o">:</span> <span class="o">!!</span> <span class="nb">window</span><span class="p">.</span><span class="nx">CanvasRenderingContext2D</span><span class="p">,</span></div><div class='line' id='LC9'>	<span class="nx">webgl</span> <span class="o">:</span> <span class="p">(</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span> <span class="k">try</span> <span class="p">{</span> <span class="k">return</span> <span class="o">!!</span> <span class="nb">window</span><span class="p">.</span><span class="nx">WebGLRenderingContext</span> <span class="o">&amp;&amp;</span> <span class="o">!!</span> <span class="nb">document</span><span class="p">.</span><span class="nx">createElement</span><span class="p">(</span> <span class="s1">&#39;canvas&#39;</span> <span class="p">).</span><span class="nx">getContext</span><span class="p">(</span> <span class="s1">&#39;experimental-webgl&#39;</span> <span class="p">);</span> <span class="p">}</span> <span class="k">catch</span><span class="p">(</span> <span class="nx">e</span> <span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="kc">false</span><span class="p">;</span> <span class="p">}</span> <span class="p">}</span> <span class="p">)(),</span></div><div class='line' id='LC10'>	<span class="nx">workers</span> <span class="o">:</span> <span class="o">!!</span> <span class="nb">window</span><span class="p">.</span><span class="nx">Worker</span><span class="p">,</span></div><div class='line' id='LC11'>	<span class="nx">fileapi</span> <span class="o">:</span> <span class="nb">window</span><span class="p">.</span><span class="nx">File</span> <span class="o">&amp;&amp;</span> <span class="nb">window</span><span class="p">.</span><span class="nx">FileReader</span> <span class="o">&amp;&amp;</span> <span class="nb">window</span><span class="p">.</span><span class="nx">FileList</span> <span class="o">&amp;&amp;</span> <span class="nb">window</span><span class="p">.</span><span class="nx">Blob</span><span class="p">,</span></div><div class='line' id='LC12'><br/></div><div class='line' id='LC13'>	<span class="nx">getWebGLErrorMessage</span> <span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC14'><br/></div><div class='line' id='LC15'>		<span class="kd">var</span> <span class="nx">domElement</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">createElement</span><span class="p">(</span> <span class="s1">&#39;div&#39;</span> <span class="p">);</span></div><div class='line' id='LC16'><br/></div><div class='line' id='LC17'>		<span class="nx">domElement</span><span class="p">.</span><span class="nx">style</span><span class="p">.</span><span class="nx">fontFamily</span> <span class="o">=</span> <span class="s1">&#39;monospace&#39;</span><span class="p">;</span></div><div class='line' id='LC18'>		<span class="nx">domElement</span><span class="p">.</span><span class="nx">style</span><span class="p">.</span><span class="nx">fontSize</span> <span class="o">=</span> <span class="s1">&#39;13px&#39;</span><span class="p">;</span></div><div class='line' id='LC19'>		<span class="nx">domElement</span><span class="p">.</span><span class="nx">style</span><span class="p">.</span><span class="nx">textAlign</span> <span class="o">=</span> <span class="s1">&#39;center&#39;</span><span class="p">;</span></div><div class='line' id='LC20'>		<span class="nx">domElement</span><span class="p">.</span><span class="nx">style</span><span class="p">.</span><span class="nx">background</span> <span class="o">=</span> <span class="s1">&#39;#eee&#39;</span><span class="p">;</span></div><div class='line' id='LC21'>		<span class="nx">domElement</span><span class="p">.</span><span class="nx">style</span><span class="p">.</span><span class="nx">color</span> <span class="o">=</span> <span class="s1">&#39;#000&#39;</span><span class="p">;</span></div><div class='line' id='LC22'>		<span class="nx">domElement</span><span class="p">.</span><span class="nx">style</span><span class="p">.</span><span class="nx">padding</span> <span class="o">=</span> <span class="s1">&#39;1em&#39;</span><span class="p">;</span></div><div class='line' id='LC23'>		<span class="nx">domElement</span><span class="p">.</span><span class="nx">style</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="s1">&#39;475px&#39;</span><span class="p">;</span></div><div class='line' id='LC24'>		<span class="nx">domElement</span><span class="p">.</span><span class="nx">style</span><span class="p">.</span><span class="nx">margin</span> <span class="o">=</span> <span class="s1">&#39;5em auto 0&#39;</span><span class="p">;</span></div><div class='line' id='LC25'><br/></div><div class='line' id='LC26'>		<span class="k">if</span> <span class="p">(</span> <span class="o">!</span> <span class="k">this</span><span class="p">.</span><span class="nx">webgl</span> <span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC27'><br/></div><div class='line' id='LC28'>			<span class="nx">domElement</span><span class="p">.</span><span class="nx">innerHTML</span> <span class="o">=</span> <span class="nb">window</span><span class="p">.</span><span class="nx">WebGLRenderingContext</span> <span class="o">?</span> <span class="p">[</span></div><div class='line' id='LC29'>				<span class="s1">&#39;Your graphics card does not seem to support &lt;a href=&quot;http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation&quot;&gt;WebGL&lt;/a&gt;.&lt;br /&gt;&#39;</span><span class="p">,</span></div><div class='line' id='LC30'>				<span class="s1">&#39;Find out how to get it &lt;a href=&quot;http://get.webgl.org/&quot;&gt;here&lt;/a&gt;.&#39;</span></div><div class='line' id='LC31'>			<span class="p">].</span><span class="nx">join</span><span class="p">(</span> <span class="s1">&#39;\n&#39;</span> <span class="p">)</span> <span class="o">:</span> <span class="p">[</span></div><div class='line' id='LC32'>				<span class="s1">&#39;Your browser does not seem to support &lt;a href=&quot;http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation&quot;&gt;WebGL&lt;/a&gt;.&lt;br/&gt;&#39;</span><span class="p">,</span></div><div class='line' id='LC33'>				<span class="s1">&#39;Find out how to get it &lt;a href=&quot;http://get.webgl.org/&quot;&gt;here&lt;/a&gt;.&#39;</span></div><div class='line' id='LC34'>			<span class="p">].</span><span class="nx">join</span><span class="p">(</span> <span class="s1">&#39;\n&#39;</span> <span class="p">);</span></div><div class='line' id='LC35'><br/></div><div class='line' id='LC36'>		<span class="p">}</span></div><div class='line' id='LC37'><br/></div><div class='line' id='LC38'>		<span class="k">return</span> <span class="nx">domElement</span><span class="p">;</span></div><div class='line' id='LC39'><br/></div><div class='line' id='LC40'>	<span class="p">},</span></div><div class='line' id='LC41'><br/></div><div class='line' id='LC42'>	<span class="nx">addGetWebGLMessage</span> <span class="o">:</span> <span class="kd">function</span> <span class="p">(</span> <span class="nx">parameters</span> <span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC43'><br/></div><div class='line' id='LC44'>		<span class="kd">var</span> <span class="nx">parent</span><span class="p">,</span> <span class="nx">id</span><span class="p">,</span> <span class="nx">domElement</span><span class="p">;</span></div><div class='line' id='LC45'><br/></div><div class='line' id='LC46'>		<span class="nx">parameters</span> <span class="o">=</span> <span class="nx">parameters</span> <span class="o">||</span> <span class="p">{};</span></div><div class='line' id='LC47'><br/></div><div class='line' id='LC48'>		<span class="nx">parent</span> <span class="o">=</span> <span class="nx">parameters</span><span class="p">.</span><span class="nx">parent</span> <span class="o">!==</span> <span class="kc">undefined</span> <span class="o">?</span> <span class="nx">parameters</span><span class="p">.</span><span class="nx">parent</span> <span class="o">:</span> <span class="nb">document</span><span class="p">.</span><span class="nx">body</span><span class="p">;</span></div><div class='line' id='LC49'>		<span class="nx">id</span> <span class="o">=</span> <span class="nx">parameters</span><span class="p">.</span><span class="nx">id</span> <span class="o">!==</span> <span class="kc">undefined</span> <span class="o">?</span> <span class="nx">parameters</span><span class="p">.</span><span class="nx">id</span> <span class="o">:</span> <span class="s1">&#39;oldie&#39;</span><span class="p">;</span></div><div class='line' id='LC50'><br/></div><div class='line' id='LC51'>		<span class="nx">domElement</span> <span class="o">=</span> <span class="nx">Detector</span><span class="p">.</span><span class="nx">getWebGLErrorMessage</span><span class="p">();</span></div><div class='line' id='LC52'>		<span class="nx">domElement</span><span class="p">.</span><span class="nx">id</span> <span class="o">=</span> <span class="nx">id</span><span class="p">;</span></div><div class='line' id='LC53'><br/></div><div class='line' id='LC54'>		<span class="nx">parent</span><span class="p">.</span><span class="nx">appendChild</span><span class="p">(</span> <span class="nx">domElement</span> <span class="p">);</span></div><div class='line' id='LC55'><br/></div><div class='line' id='LC56'>	<span class="p">}</span></div><div class='line' id='LC57'><br/></div><div class='line' id='LC58'><span class="p">};</span></div></pre></div>
          </td>
        </tr>
      </table>
  </div>

          </div>
        </div>
      </div>
    </div>

  </div>

<div class="frame frame-loading large-loading-area" style="display:none;" data-tree-list-url="/mrdoob/three.js/tree-list/32b581f24fddeaf9e91b7825aa93ec0ad3a45c83" data-blob-url-prefix="/mrdoob/three.js/blob/32b581f24fddeaf9e91b7825aa93ec0ad3a45c83">
  <img src="https://a248.e.akamai.net/assets.github.com/images/spinners/octocat-spinner-64.gif?1329872006" height="64" width="64">
</div>

      </div>
      <div class="context-overlay"></div>
    </div>


      <!-- footer -->
      <div id="footer" >
        
  <div class="upper_footer">
     <div class="container clearfix">

       <!--[if IE]><h4 id="blacktocat_ie">GitHub Links</h4><![endif]-->
       <![if !IE]><h4 id="blacktocat">GitHub Links</h4><![endif]>

       <ul class="footer_nav">
         <h4>GitHub</h4>
         <li><a href="https://github.com/about">About</a></li>
         <li><a href="https://github.com/blog">Blog</a></li>
         <li><a href="https://github.com/features">Features</a></li>
         <li><a href="https://github.com/contact">Contact &amp; Support</a></li>
         <li><a href="https://github.com/training">Training</a></li>
         <li><a href="http://enterprise.github.com/">GitHub Enterprise</a></li>
         <li><a href="http://status.github.com/">Site Status</a></li>
       </ul>

       <ul class="footer_nav">
         <h4>Tools</h4>
         <li><a href="http://get.gaug.es/">Gauges: Analyze web traffic</a></li>
         <li><a href="http://speakerdeck.com">Speaker Deck: Presentations</a></li>
         <li><a href="https://gist.github.com">Gist: Code snippets</a></li>
         <li><a href="http://mac.github.com/">GitHub for Mac</a></li>
         <li><a href="http://mobile.github.com/">Issues for iPhone</a></li>
         <li><a href="http://jobs.github.com/">Job Board</a></li>
       </ul>

       <ul class="footer_nav">
         <h4>Extras</h4>
         <li><a href="http://shop.github.com/">GitHub Shop</a></li>
         <li><a href="http://octodex.github.com/">The Octodex</a></li>
       </ul>

       <ul class="footer_nav">
         <h4>Documentation</h4>
         <li><a href="http://help.github.com/">GitHub Help</a></li>
         <li><a href="http://developer.github.com/">Developer API</a></li>
         <li><a href="http://github.github.com/github-flavored-markdown/">GitHub Flavored Markdown</a></li>
         <li><a href="http://pages.github.com/">GitHub Pages</a></li>
       </ul>

     </div><!-- /.site -->
  </div><!-- /.upper_footer -->

<div class="lower_footer">
  <div class="container clearfix">
    <!--[if IE]><div id="legal_ie"><![endif]-->
    <![if !IE]><div id="legal"><![endif]>
      <ul>
          <li><a href="https://github.com/site/terms">Terms of Service</a></li>
          <li><a href="https://github.com/site/privacy">Privacy</a></li>
          <li><a href="https://github.com/security">Security</a></li>
      </ul>

      <p>&copy; 2012 <span title="0.13802s from fe3.rs.github.com">GitHub</span> Inc. All rights reserved.</p>
    </div><!-- /#legal or /#legal_ie-->

      <div class="sponsor">
        <a href="http://www.rackspace.com" class="logo">
          <img alt="Dedicated Server" height="36" src="https://a248.e.akamai.net/assets.github.com/images/modules/footer/rackspaces_logo.png?1329521041" width="38" />
        </a>
        Powered by the <a href="http://www.rackspace.com ">Dedicated
        Servers</a> and<br/> <a href="http://www.rackspacecloud.com">Cloud
        Computing</a> of Rackspace Hosting<span>&reg;</span>
      </div>
  </div><!-- /.site -->
</div><!-- /.lower_footer -->

      </div><!-- /#footer -->

    

<div id="keyboard_shortcuts_pane" class="instapaper_ignore readability-extra" style="display:none">
  <h2>Keyboard Shortcuts <small><a href="#" class="js-see-all-keyboard-shortcuts">(see all)</a></small></h2>

  <div class="columns threecols">
    <div class="column first">
      <h3>Site wide shortcuts</h3>
      <dl class="keyboard-mappings">
        <dt>s</dt>
        <dd>Focus site search</dd>
      </dl>
      <dl class="keyboard-mappings">
        <dt>?</dt>
        <dd>Bring up this help dialog</dd>
      </dl>
    </div><!-- /.column.first -->

    <div class="column middle" style='display:none'>
      <h3>Commit list</h3>
      <dl class="keyboard-mappings">
        <dt>j</dt>
        <dd>Move selection down</dd>
      </dl>
      <dl class="keyboard-mappings">
        <dt>k</dt>
        <dd>Move selection up</dd>
      </dl>
      <dl class="keyboard-mappings">
        <dt>c <em>or</em> o <em>or</em> enter</dt>
        <dd>Open commit</dd>
      </dl>
      <dl class="keyboard-mappings">
        <dt>y</dt>
        <dd>Expand URL to its canonical form</dd>
      </dl>
    </div><!-- /.column.first -->

    <div class="column last" style='display:none'>
      <h3>Pull request list</h3>
      <dl class="keyboard-mappings">
        <dt>j</dt>
        <dd>Move selection down</dd>
      </dl>
      <dl class="keyboard-mappings">
        <dt>k</dt>
        <dd>Move selection up</dd>
      </dl>
      <dl class="keyboard-mappings">
        <dt>o <em>or</em> enter</dt>
        <dd>Open issue</dd>
      </dl>
    </div><!-- /.columns.last -->

  </div><!-- /.columns.equacols -->

  <div style='display:none'>
    <div class="rule"></div>

    <h3>Issues</h3>

    <div class="columns threecols">
      <div class="column first">
        <dl class="keyboard-mappings">
          <dt>j</dt>
          <dd>Move selection down</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>k</dt>
          <dd>Move selection up</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>x</dt>
          <dd>Toggle selection</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>o <em>or</em> enter</dt>
          <dd>Open issue</dd>
        </dl>
      </div><!-- /.column.first -->
      <div class="column middle">
        <dl class="keyboard-mappings">
          <dt>I</dt>
          <dd>Mark selection as read</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>U</dt>
          <dd>Mark selection as unread</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>e</dt>
          <dd>Close selection</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>y</dt>
          <dd>Remove selection from view</dd>
        </dl>
      </div><!-- /.column.middle -->
      <div class="column last">
        <dl class="keyboard-mappings">
          <dt>c</dt>
          <dd>Create issue</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>l</dt>
          <dd>Create label</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>i</dt>
          <dd>Back to inbox</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>u</dt>
          <dd>Back to issues</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>/</dt>
          <dd>Focus issues search</dd>
        </dl>
      </div>
    </div>
  </div>

  <div style='display:none'>
    <div class="rule"></div>

    <h3>Issues Dashboard</h3>

    <div class="columns threecols">
      <div class="column first">
        <dl class="keyboard-mappings">
          <dt>j</dt>
          <dd>Move selection down</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>k</dt>
          <dd>Move selection up</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>o <em>or</em> enter</dt>
          <dd>Open issue</dd>
        </dl>
      </div><!-- /.column.first -->
    </div>
  </div>

  <div style='display:none'>
    <div class="rule"></div>

    <h3>Network Graph</h3>
    <div class="columns equacols">
      <div class="column first">
        <dl class="keyboard-mappings">
          <dt><span class="badmono">←</span> <em>or</em> h</dt>
          <dd>Scroll left</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt><span class="badmono">→</span> <em>or</em> l</dt>
          <dd>Scroll right</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt><span class="badmono">↑</span> <em>or</em> k</dt>
          <dd>Scroll up</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt><span class="badmono">↓</span> <em>or</em> j</dt>
          <dd>Scroll down</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>t</dt>
          <dd>Toggle visibility of head labels</dd>
        </dl>
      </div><!-- /.column.first -->
      <div class="column last">
        <dl class="keyboard-mappings">
          <dt>shift <span class="badmono">←</span> <em>or</em> shift h</dt>
          <dd>Scroll all the way left</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>shift <span class="badmono">→</span> <em>or</em> shift l</dt>
          <dd>Scroll all the way right</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>shift <span class="badmono">↑</span> <em>or</em> shift k</dt>
          <dd>Scroll all the way up</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>shift <span class="badmono">↓</span> <em>or</em> shift j</dt>
          <dd>Scroll all the way down</dd>
        </dl>
      </div><!-- /.column.last -->
    </div>
  </div>

  <div >
    <div class="rule"></div>
    <div class="columns threecols">
      <div class="column first" >
        <h3>Source Code Browsing</h3>
        <dl class="keyboard-mappings">
          <dt>t</dt>
          <dd>Activates the file finder</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>l</dt>
          <dd>Jump to line</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>w</dt>
          <dd>Switch branch/tag</dd>
        </dl>
        <dl class="keyboard-mappings">
          <dt>y</dt>
          <dd>Expand URL to its canonical form</dd>
        </dl>
      </div>
    </div>
  </div>
</div>

    <div id="markdown-help" class="instapaper_ignore readability-extra">
  <h2>Markdown Cheat Sheet</h2>

  <div class="cheatsheet-content">

  <div class="mod">
    <div class="col">
      <h3>Format Text</h3>
      <p>Headers</p>
      <pre>
# This is an &lt;h1&gt; tag
## This is an &lt;h2&gt; tag
###### This is an &lt;h6&gt; tag</pre>
     <p>Text styles</p>
     <pre>
*This text will be italic*
_This will also be italic_
**This text will be bold**
__This will also be bold__

*You **can** combine them*
</pre>
    </div>
    <div class="col">
      <h3>Lists</h3>
      <p>Unordered</p>
      <pre>
* Item 1
* Item 2
  * Item 2a
  * Item 2b</pre>
     <p>Ordered</p>
     <pre>
1. Item 1
2. Item 2
3. Item 3
   * Item 3a
   * Item 3b</pre>
    </div>
    <div class="col">
      <h3>Miscellaneous</h3>
      <p>Images</p>
      <pre>
![GitHub Logo](/images/logo.png)
Format: ![Alt Text](url)
</pre>
     <p>Links</p>
     <pre>
http://github.com - automatic!
[GitHub](http://github.com)</pre>
<p>Blockquotes</p>
     <pre>
As Kanye West said:

> We're living the future so
> the present is our past.
</pre>
    </div>
  </div>
  <div class="rule"></div>

  <h3>Code Examples in Markdown</h3>
  <div class="col">
      <p>Syntax highlighting with <a href="http://github.github.com/github-flavored-markdown/" title="GitHub Flavored Markdown" target="_blank">GFM</a></p>
      <pre>
```javascript
function fancyAlert(arg) {
  if(arg) {
    $.facebox({div:'#foo'})
  }
}
```</pre>
    </div>
    <div class="col">
      <p>Or, indent your code 4 spaces</p>
      <pre>
Here is a Python code example
without syntax highlighting:

    def foo:
      if not bar:
        return true</pre>
    </div>
    <div class="col">
      <p>Inline code for comments</p>
      <pre>
I think you should use an
`&lt;addr&gt;` element here instead.</pre>
    </div>
  </div>

  </div>
</div>


    <div class="ajax-error-message">
      <p><span class="icon"></span> Something went wrong with that request. Please try again. <a href="javascript:;" class="ajax-error-dismiss">Dismiss</a></p>
    </div>

    
    
    
    <span id='server_response_time' data-time='0.13903' data-host='fe3'></span>
  </body>
</html>

