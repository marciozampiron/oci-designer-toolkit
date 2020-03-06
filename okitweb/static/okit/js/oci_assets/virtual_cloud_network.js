/*
** Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
console.info('Loaded Virtual Cloud Network Javascript');

/*
** Set Valid drop Targets
 */
asset_drop_targets[virtual_cloud_network_artifact] = [compartment_artifact];
asset_connect_targets[virtual_cloud_network_artifact] = [];

const virtual_cloud_network_query_cb = "virtual-cloud-network-query-cb";

/*
** Define Virtual Cloud Network Artifact Class
 */
class VirtualCloudNetwork extends OkitContainerArtifact {
    /*
    ** Create
     */
    constructor (data={}, okitjson={}, parent=null) {
        super(okitjson);
        this.parent_id = data.parent_id;
        // Configure default values
        this.display_name = this.generateDefaultName(okitjson.virtual_cloud_networks.length + 1);
        this.compartment_id = data.parent_id;
        // Generate Cidr
        this.cidr_block = '10.' + okitjson.virtual_cloud_networks.length + '.0.0/16';
        this.dns_label = this.display_name.toLowerCase().slice(-6);
        // Update with any passed data
        for (let key in data) {
            this[key] = data[key];
        }
        // Add Get Parent function
        if (parent !== null) {
            this.getParent = function() {return parent};
        } else {
            this.getParent = function () {
                for (let parent of okitjson.compartments) {
                    if (parent.id === this.parent_id) {
                        return parent
                    }
                }
                return null;
            }
        }
        console.groupCollapsed('Check if default Security List & Route Table Should be created.');
        if (okitSettings.is_default_route_table) {
            console.info('Creating Default Route Table');
            this.getOkitJson().newRouteTable({parent_id: this.id, vcn_id: this.id, compartment_id: this.compartment_id}, this);
        }
        if (okitSettings.is_default_security_list) {
            console.info('Creating Default Security List');
            let security_list = this.getOkitJson().newSecurityList({parent_id: this.id, vcn_id: this.id, compartment_id: this.compartment_id}, this);
            security_list.addDefaultSecurityListRules(this.cidr_block);
        }
        console.groupEnd();
    }


    /*
    ** Clone Functionality
     */
    clone() {
        return new VirtualCloudNetwork(this, this.getOkitJson());
    }


    /*
    ** Get the Artifact name this Artifact will be know by.
     */
    getArtifactReference() {
        return virtual_cloud_network_artifact;
    }


    /*
    ** Delete Processing
     */
    delete() {
        console.groupCollapsed('Delete ' + this.getArtifactReference() + ' : ' + this.id);
        // Delete Child Artifacts
        this.deleteChildren();
        // Remove SVG Element
        d3.select("#" + this.id + "-svg").remove()
        console.groupEnd();
    }

    deleteChildren() {
        console.groupCollapsed('Deleting Children of ' + this.getArtifactReference() + ' : ' + this.display_name);
        // Remove Subnets
        this.getOkitJson().subnets = this.getOkitJson().subnets.filter(function(child) {
            if (child.vcn_id === this.id) {
                console.info('Deleting ' + child.display_name);
                child.delete();
                return false; // So the filter removes the element
            }
            return true;
        }, this);
        // Remove Route_tables
        this.getOkitJson().route_tables = this.getOkitJson().route_tables.filter(function(child) {
            if (child.vcn_id === this.id) {
                console.info('Deleting ' + child.display_name);
                child.delete();
                return false; // So the filter removes the element
            }
            return true;
        }, this);
        // Remove Security Lists
        this.getOkitJson().security_lists = this.getOkitJson().security_lists.filter(function(child) {
            if (child.vcn_id === this.id) {
                console.info('Deleting ' + child.display_name);
                child.delete();
                return false; // So the filter removes the element
            }
            return true;
        }, this);
        // Remove Internet Gateways
        this.getOkitJson().internet_gateways = this.getOkitJson().internet_gateways.filter(function(child) {
            if (child.vcn_id === this.id) {
                console.info('Deleting ' + child.display_name);
                child.delete();
                return false; // So the filter removes the element
            }
            return true;
        }, this);
        // Remove NAT Gateways
        this.getOkitJson().nat_gateways = this.getOkitJson().nat_gateways.filter(function(child) {
            if (child.vcn_id === this.id) {
                console.info('Deleting ' + child.display_name);
                child.delete();
                return false; // So the filter removes the element
            }
            return true;
        }, this);
        // Remove Service Gateways
        this.getOkitJson().service_gateways = this.getOkitJson().service_gateways.filter(function(child) {
            if (child.vcn_id === this.id) {
                console.info('Deleting ' + child.display_name);
                child.delete();
                return false; // So the filter removes the element
            }
            return true;
        }, this);
        // Local Peering Gateways
        this.getOkitJson().local_peering_gateways = this.getOkitJson().local_peering_gateways.filter(function(child) {
            if (child.vcn_id === this.id) {
                console.info('Deleting ' + child.display_name);
                child.delete();
                return false; // So the filter removes the element
            }
            return true;
        }, this);
        console.groupEnd();
    }


    /*
     ** SVG Processing
     */
    draw() {
        this.parent_id = this.compartment_id;
        console.groupCollapsed('Drawing ' + virtual_cloud_network_artifact + ' : ' + this.id + ' [' + this.parent_id + ']');
        let svg = drawArtifact(this.getSvgDefinition());
        // Add Properties Load Event to created svg
        let me = this;
        svg.on("click", function() {
            me.loadProperties();
            d3.event.stopPropagation();
        });
        console.groupEnd();
    }

    getSvgDefinition() {
        console.groupCollapsed('Getting Definition of ' + this.getArtifactReference() + ' : ' + this.id);
        let dimensions = this.getDimensions(this.id);
        let definition = this.newSVGDefinition(this, virtual_cloud_network_artifact);
        //let parent_first_child = getCompartmentFirstChildContainerOffset(this.compartment_id);
        let parent_first_child = this.getParent().getChildOffset(this.getArtifactReference());
        definition['svg']['x'] = parent_first_child.dx;
        definition['svg']['y'] = parent_first_child.dy;
        definition['svg']['width'] = dimensions['width'];
        definition['svg']['height'] = dimensions['height'];
        definition['rect']['stroke']['colour'] = stroke_colours.purple;
        definition['rect']['stroke']['dash'] = 5;
        definition['icon']['x_translation'] = icon_translate_x_start;
        definition['icon']['y_translation'] = icon_translate_y_start;
        definition['name']['show'] = true;
        definition['label']['show'] = true;
        definition['info']['show'] = true;
        definition['info']['text'] = this.cidr_block;
        console.info(JSON.stringify(definition, null, 2));
        console.groupEnd();
        return definition;
    }

    getDimensions() {
        return super.getDimensions('vcn_id');
    }

    getMinimumDimensions() {
        return {width: 400, height: 300};
    }


    /*
    ** Property Sheet Load function
     */
    loadProperties() {
        let okitJson = this.getOkitJson();
        let me = this;
        $("#properties").load("propertysheets/virtual_cloud_network.html", function () {
            // Load Properties
            loadPropertiesSheet(me);
            // Add Event Listeners
            addPropertiesEventListeners(me, []);
        });
    }


    /*
    ** Define Allowable SVG Drop Targets
     */
    getTargets() {
        return [compartment_artifact];
    }


    /*
    ** Artifact Specific Functions
     */
    hasUnattachedSecurityList() {
        for (let security_list of this.getOkitJson().security_lists) {
            if (security_list.vcn_id === this.id) {
                return true;
            }
        }
        return false;
    }

    hasUnattachedRouteTable() {
         for (let route_table of this.getOkitJson().route_tables) {
            if (route_table.vcn_id === this.id) {
                return true;
            }
        }
        return false;
    }

    getGateways() {
        let gateways = [];
        // Internet Gateways
        gateways.push(...this.getInternetGateways());
        // NAT Gateways
        gateways.push(...this.getNATGateways());
        // Local Peering Gateways
        gateways.push(...this.getLocalPeeringGateways());
        // Service Gateways
        gateways.push(...this.getServiceGateways());
        // Dynamic Routing Gateways
        gateways.push(...this.getDynamicRoutingGateways());
        return gateways;
    }

    getInternetGateways() {
        let gateways = [];
        // Internet Gateways
        for (let gateway of this.getOkitJson().internet_gateways) {
            if (gateway.vcn_id === this.id) {
                gateways.push(gateway);
            }
        }
        return gateways;
    }

    getNATGateways() {
        let gateways = [];
        // NAT Gateways
        for (let gateway of this.getOkitJson().nat_gateways) {
            if (gateway.vcn_id === this.id) {
                gateways.push(gateway);
            }
        }
        return gateways;
    }

    getLocalPeeringGateways() {
        let gateways = [];
        // NAT Gateways
        for (let gateway of this.getOkitJson().local_peering_gateways) {
            if (gateway.vcn_id === this.id) {
                gateways.push(gateway);
            }
        }
        return gateways;
    }

    getServiceGateways() {
        let gateways = [];
        // Service Gateways
        for (let gateway of this.getOkitJson().service_gateways) {
            if (gateway.vcn_id === this.id) {
                gateways.push(gateway);
            }
        }
        return gateways;
    }

    getDynamicRoutingGateways() {
        let gateways = [];
        // Dynamic Routing Gateways
        for (let gateway of this.getOkitJson().dynamic_routing_gateways) {
            if (gateway.vcn_id === this.id) {
                gateways.push(gateway);
            }
        }
        return gateways;
    }


    /*
    ** Child Artifact Functions
     */
    getTopEdgeArtifacts() {
        return [internet_gateway_artifact, nat_gateway_artifact];
    }

    getTopArtifacts() {
        return [route_table_artifact, security_list_artifact];
    }

    getContainerArtifacts() {
        return [subnet_artifact];
    }

    getRightEdgeArtifacts() {
        return[service_gateway_artifact, dynamic_routing_gateway_artifact, local_peering_gateway_artifact]
    }

    getBottomEdgeArtifacts() {
        return [];
    }


    /*
    ** Container Specific Overrides
     */
    // return the name of the element used by the child to reference this artifact
    getParentKey() {
        return 'vcn_id';
    }

    getNamePrefix() {
        return super.getNamePrefix() + 'vcn';
    }

    /*
    ** Static Functionality
     */
    static getArtifactReference() {
        return 'Virtual Cloud Network';
    }

    static getDropTargets() {
        return [Compartment.getArtifactReference()];
    }

    static query(request = {}, region='') {
        console.info('------------- Virtual Cloud Network Query --------------------');
        console.info('------------- Compartment           : ' + request.compartment_id);
        let me = this;
        $.ajax({
            type: 'get',
            url: 'oci/artifacts/VirtualCloudNetwork',
            dataType: 'text',
            contentType: 'application/json',
            data: JSON.stringify(request),
            success: function(resp) {
                let response_json = JSON.parse(resp);
                regionOkitJson[region].load({virtual_cloud_networks: response_json});
                for (let artifact of response_json) {
                    console.info(me.getArtifactReference() + ' Query : ' + artifact.display_name);
                    me.querySubComponents(request, region, artifact.id);
                }
                redrawSVGCanvas(region);
                $('#' + virtual_cloud_network_query_cb).prop('checked', true);
                hideQueryProgressIfComplete();
            },
            error: function(xhr, status, error) {
                console.info('Status : ' + status)
                console.info('Error  : ' + error)
                $('#' + virtual_cloud_network_query_cb).prop('checked', true);
                hideQueryProgressIfComplete();
            }
        });
    }

    static querySubComponents(request = {}, region='', id='') {
        let sub_query_request = JSON.clone(request);
        sub_query_request.vcn_id = id;
        InternetGateway.query(sub_query_request, region);
        NATGateway.query(sub_query_request, region);
        ServiceGateway.query(sub_query_request, region);
        LocalPeeringGateway.query(sub_query_request, region);
        RouteTable.query(sub_query_request, region);
        SecurityList.query(sub_query_request, region);
        Subnet.query(sub_query_request, region);
    }
}

$(document).ready(function() {
    // Setup Search Checkbox
    let body = d3.select('#query-progress-tbody');
    let row = body.append('tr');
    let cell = row.append('td');
    cell.append('input')
        .attr('type', 'checkbox')
        .attr('id', virtual_cloud_network_query_cb);
    cell.append('label').text(virtual_cloud_network_artifact);

    // Setup Query Display Form
    body = d3.select('#query-oci-tbody');
    row = body.append('tr');
    cell = row.append('td')
        .text(virtual_cloud_network_artifact);
    cell = row.append('td');
    let input = cell.append('input')
        .attr('type', 'text')
        .attr('class', 'query-filter')
        .attr('id', 'virtual_cloud_network_name_filter')
        .attr('name', 'virtual_cloud_network_name_filter');
});
