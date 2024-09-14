<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=0.75">
    <meta name="description" lang="en" content="The interactive FM transmitter maps" />
    <title>FM-DX Maps</title>

    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
    <link rel="stylesheet" type="text/css" href="style/style.css?rev=20240216" />
    <link rel="stylesheet" type="text/css" href="style/map.css?rev=20240216" />
    <link rel="stylesheet" type="text/css" href="style/list.css?rev=20240216" />
    <link rel="stylesheet" type="text/css" href="style/info.css?rev=20240305" />
    <link rel="stylesheet" type="text/css" href="lib/leaflet.css?rev=20240209" />
    <script type="text/javascript" src="lib/leaflet.js?rev=20240209"></script>
    <script type="text/javascript" src="lib/leaflet.geodesic.js?rev=20240209"></script>
    <script type="text/javascript" src="script/utils.js?rev=20240310"></script>
    <script type="text/javascript" src="script/clipboard.js?rev=20240310"></script>
    <script type="text/javascript" src="script/fetch.js?rev=20240310"></script>
    <script type="text/javascript" src="script/dataset.js?rev=20240312"></script>
    <script type="text/javascript" src="script/icons.js?rev=20240310"></script>
    <script type="text/javascript" src="script/frequency.js?rev=20240310"></script>
    <script type="text/javascript" src="script/geoloc.js?rev=20240310"></script>
    <script type="text/javascript" src="script/selection.js?rev=20240310"></script>
    <script type="text/javascript" src="script/paths.js?rev=20240310"></script>
    <script type="text/javascript" src="script/tiles.js?rev=20240310"></script>
    <script type="text/javascript" src="script/coverage.js?rev=20240310"></script>
    <script type="text/javascript" src="script/map.js?rev=20240724"></script>
    <script type="text/javascript" src="script/map-share.js?rev=20240310"></script>
    <script type="text/javascript" src="script/list.js?rev=20240310"></script>
    <script type="text/javascript" src="script/app.js?rev=20240724"></script>
</head>

<body>
<div id="map"></div>
<div id="info" class="box"></div>

<div id="sidebar" class="box">
    <div id="header">
        <div id="title">&nbsp;</div>
        <div id="error"></div>
    </div>

    <div id="expandable">
        <div id="filters">
            <table class="filters">
                <tr>
                    <td>
                        Country:
                        <select id="itu" name="itu">
                            <option selected disabled>…</option>
                            <?php include("api/data-list.php"); ?>
                        </select>
                    </td>
                    <td>
                        <form id="freq_form">
                            Frequency: <input id="freq" name="freq" autocomplete="off" style="width: 4.5em;" /> <input type="submit" value="OK" />
                        </form>
                    </td>
                </tr>
            </table>

            <table class="filters">
                <tr>
                    <td>
                        <input type="checkbox" id="keep_map" /><label for="keep_map">Keep position</label>
                    </td>
                    <td>
                        <span id="geolocation_box"><input type="checkbox" id="geolocation" /><label for="geolocation">Geolocation</label></span>
                        <span id="foreign_qth" style="display: none"><b>[Foreign QTH]</b></span>
                    </td>
                    <td>
                        <input type="checkbox" id="dark" /><label for="dark">Dark mode</label>
                    </td>
                </tr>
            </table>

            <hr />
            <table class="filters">
                <tr>
                    <td>
                        ERP &ge; <input id="erp" type="number" min="0" placeholder="0 kW" style="width: 4.5em;" /> <span id="erp_off" class="filter_off">&#x2715;</span>
                    </td>
                    <td>
                        Pol: <select id="pol"><option></option><option value="h">H</option><option value="v">V</option></select> <span id="pol_off" class="filter_off">&#x2715;</span>
                    </td>
                    <td>
                        PI: <input id="pi" type="text" maxlength="4" style="width: 3em;" pattern="[a-fA-F\d]" /> <span id="pi_off" class="filter_off">&#x2715;</span>
                    </td>
                </tr>
            </table>

            <table class="filters">
                <tr>
                    <td width="50%">
                        <input type="checkbox" id="active" /><label for="active" id="label_active">Discard inactive</label>
                    </td>
                    <td width="50%">
                        <input type="checkbox" id="marked" /><label for="marked" id="label_marked">Only marked</label>
                    </td>
                </tr>
            </table>

            <div id="status">&nbsp;</div>
        </div>

        <div id="content">
            <hr />
            <div id="help">
                <b>Setup your location</b><br />
                Click on the map with a right mouse button to set your location. Drag and drop the marker in order to change the position again.<br />
                <br />
                <b>Mouse usage</b><br />
                Left button: show details<br />
                Right button: toggle path<br />
                <br />
                <b>Data sources</b><br />
                Use navigation buttons in your web browser (back or forward) to move between used data sources.<br />
                <br />
                <span style="line-height: 175%;">
                    <img src="img/tx-lo.png" style="vertical-align: middle;" alt="TX" /> – Low power (&lt; 0.5 kW ERP)<br />
                    <img src="img/tx-med.png" style="vertical-align: middle;" alt="TX" /> – Medium power (&ge; 0.5 kW ERP)<br />
                    <img src="img/tx-hi.png" style="vertical-align: middle;" alt="TX" /> – High power (&ge; 5 kW ERP)<br />
                </span>
            </div>
        </div>

        <div id="copyright"><a href="http://fmdx.pl" target="_blank"><img style="vertical-align: middle;" alt="))((" src="img/logo.png" /> FMDX.pl</a><span id="source"></span></div>

        <progress id="progress"></progress>
    </div>
</div>

</body>
</html>
