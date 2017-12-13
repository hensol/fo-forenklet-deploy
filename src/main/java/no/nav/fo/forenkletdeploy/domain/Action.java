package no.nav.fo.forenkletdeploy.domain;

import lombok.Data;
import lombok.experimental.Accessors;

import static java.util.Optional.ofNullable;
import static no.nav.fo.forenkletdeploy.domain.ActionType.*;

@Data
@Accessors(chain = true)
public class Action {

    public String type;
    public Object data;

    public Action setType(ActionType actionType){
        this.type = actionType.name();
        return this;
    }

    public static Action event(Event event){
        return new Action()
                .setType(EVENT)
                .setData(event);
    }

    public static Action status(Status status){
        return new Action()
                .setType(status.type)
                .setData(status);
    }

    public static Action commit(Commit commit){
        return new Action()
                .setType(COMMIT)
                .setData(commit);
    }

    public static Action version(Version version) {
        return new Action()
                .setType(VERSION)
                .setData(version)
                ;
    }

    public static Action commitsProvided() {
        return new Action().setType(COMMITS_PROVIDED);
    }

    public static Action eventsProvided() {
        return new Action().setType(EVENTS_PROVIDED);
    }

    public static Action statusProvided() {
        return new Action().setType(STATUS_PROVIDED);
    }

    public static Action error(Throwable t) {
        return new Action()
                .setType(ERROR)
                .setData(ofNullable(t.getMessage()).orElse(t.getClass().getSimpleName()));
    }
}
