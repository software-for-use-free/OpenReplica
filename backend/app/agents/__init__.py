"""
Agent management module
"""
from .base import Agent, AgentConfig, AgentState


def get_available_agents():
    """Get list of available agent types"""
    return ['codeact', 'browsing', 'dummy']


def create_agent(agent_type: str, config: AgentConfig) -> Agent:
    """Create an agent instance of the specified type"""
    if agent_type == 'codeact':
        from .codeact.agent import CodeActAgent
        return CodeActAgent(config)
    elif agent_type == 'browsing':
        from .browsing.agent import BrowsingAgent
        return BrowsingAgent(config)
    elif agent_type == 'dummy':
        from .dummy.agent import DummyAgent
        return DummyAgent(config)
    else:
        raise ValueError(f"Unknown agent type: {agent_type}")
