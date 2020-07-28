/*
** Copyright (c) 2020, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
console.info('Loaded Local Peering Gateway Javascript');

const local_peering_gateway_query_cb = "local-peering-gateway-query-cb";

/*
** Define Local Peering Gateway Class
 */
class LocalPeeringGateway extends OkitArtifact {
    /*
    ** Create
     */
    constructor (data={}, okitjson={}) {
        super(okitjson);
        // Configure default values
        this.display_name = this.generateDefaultName(okitjson.local_peering_gateways.length + 1);
        this.compartment_id = '';
        this.vcn_id = data.parent_id;
        this.route_table_id = '';
        this.peer_id = '';
        // Update with any passed data
        this.merge(data);
        this.convert();
    }


    /*
    ** Clone Functionality
     */
    clone() {
        return new LocalPeeringGateway(this, this.getOkitJson());
    }


    /*
    ** Delete Processing
     */
    deleteChildren() {}


    getNamePrefix() {
        return super.getNamePrefix() + 'lpg';
    }

    /*
    ** Static Functionality
     */
    static getArtifactReference() {
        return 'Local Peering Gateway';
    }

}

function setPeeredGatewayPeerId(input_id, artefact) {
    if (input_id === 'peer_id' && artefact.peer_id) {
        okitJson.getLocalPeeringGateway(artefact.peer_id).peer_id = artefact.id;
    }
}

$(document).ready(function() {
    // Setup Search Checkbox
    let body = d3.select('#query-progress-tbody');
    let row = body.append('tr');
    let cell = row.append('td');
    cell.append('input')
        .attr('type', 'checkbox')
        .attr('id', local_peering_gateway_query_cb);
    cell.append('label').text(LocalPeeringGateway.getArtifactReference());

    // Setup Query Display Form
    body = d3.select('#query-oci-tbody');
    row = body.append('tr');
    cell = row.append('td')
        .text(LocalPeeringGateway.getArtifactReference());
    cell = row.append('td');
    let input = cell.append('input')
        .attr('type', 'text')
        .attr('class', 'query-filter')
        .attr('id', 'local_peering_gateway_name_filter')
        .attr('name', 'local_peering_gateway_name_filter');
});