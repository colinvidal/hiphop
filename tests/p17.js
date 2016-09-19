"use hopscript"

var hh = require("hiphop");

var prg = <hh.module O>
  <hh.loop>
    <hh.let S1>
      <hh.sequence>
	<hh.if S1>
	  <hh.emit O/>
	</hh.if>
	<hh.pause/>
	<hh.emit S1/>
      </hh.sequence>
    </hh.let>
  </hh.loop>
</hh.module>;

exports.prg = new hh.ReactiveMachine(prg, "P17")
